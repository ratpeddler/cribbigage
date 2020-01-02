import { Hand } from "./deal";
import { Card, parseCard, parseRank } from "./card";
import { GameState } from "./game";
import { addPlayerScore } from "./score";
import { PlayerState } from "./players";
import { IScore } from "./../components/scoreIcon";
import { IPlayLogContext } from "../components/playLog";

/** Max play count. A single play cannot exceed this value e.g. 31 */
const MAX_PLAY_COUNT = 31;

/** Score for reaching max play count exaclty (e.g. 31 for 2) */
const SCORE_MAX_COUNT = 2;
const SCORE_PER_FIFTEEN = 2;
const SCORE_PER_PAIR = 2;
const SCORE_PER_RUN_CARD = 1;
const SCORE_GO = 1;
const SCORE_LAST_CARD = 1;

export function getPlayableHand(player: PlayerState, game: GameState) {
    const { playedCards, previousPlayedCards } = game;
    return filterHand(player.hand, playedCards, previousPlayedCards);
}

export function filterHand(hand: Hand, playedCards: Hand = [], previousPlayedCards: Hand = []) {
    return hand.filter(c => playedCards.indexOf(c) < 0).filter(c => previousPlayedCards.indexOf(c) < 0);
}

export function sumCards(cards: Hand) {
    let sum = 0;
    cards.forEach(card => sum += parseCard(card).count);
    return sum;
}

export function canPlay(playedCards: Hand | undefined, newCard: Card) {
    if (!playedCards || playedCards.length === 0) { return true; }
    const currentCount = sumCards(playedCards);
    return currentCount + parseCard(newCard).count <= MAX_PLAY_COUNT;
}

// TODO: this should handle previously played cards as well
export function cantPlayAtAll(user: PlayerState, playedCards: Hand = [], previousPlayedCards: Hand = []) {
    const hand = filterHand(user.hand, playedCards, previousPlayedCards);
    for (let card of hand) {
        // skip cards that have been played
        if (canPlay(playedCards, card)) {
            return false;
        }
    }

    return true;
}

export function playStageOver(game: GameState) {
    for (let player of game.players) {
        let hand = filterHand(player.hand, game.playedCards, game.previousPlayedCards);
        if (hand.length > 0) {
            return false;
        }
    }

    return true;
}

export function incrementNextPlayer(game: GameState): number {
    return (ensureNextPlayer(game) + 1) % game.players.length;
}

export function ensureNextPlayer(game: GameState): number {
    if (!game.nextToPlay) {
        return 0;
    }

    return game.nextToPlay % game.players.length;
}

export function getCurrentPlayer(game: GameState): PlayerState {
    return game.players[ensureNextPlayer(game)];
}

export function getCurrentDealer(game: GameState): PlayerState {
    return game.players[game.players.length - 1];
}

export function playCard(game: GameState, card: Card, logContext: IPlayLogContext): GameState {
    let { playedCards = [] } = game;
    const player = getCurrentPlayer(game);

    if (!canPlay(playedCards, card)) {
        throw `Can't play that! ${card}`;
    }

    game.lastToPlay = ensureNextPlayer(game);

    // SCORE
    const playScore = scorePlay(playedCards, card);
    addPlayerScore(player, playScore.score, game);

    // Add played cards
    playedCards = game.playedCards = [...playedCards, card];
    player.playedCards = [...player.playedCards || [], card];

    // Last Card: check if the round is over. If so you get 1 point for last card IFF the count is not 31
    if (playStageOver(game) && sumCards(playedCards) !== 31) {
        addPlayerScore(player, SCORE_LAST_CARD, game);
        playScore.lastCard = 1;
        playScore.score++;
    }
    
    logContext.addLog(player, "played " + parseCard(card).value + " of " + parseCard(card).suit, playScore);

    return {
        ...game,
        nextToPlay: incrementNextPlayer(game),
    }
}

export function pass(game: GameState, logContext: IPlayLogContext): GameState {
    const player = getCurrentPlayer(game);

    // pass to the next player and check if there has been a GO
    if (game.lastToPlay != undefined && game.nextToPlay === game.lastToPlay) {
        const { previousPlayedCards = [], playedCards = [] } = game;

        // GO: check for 31 since you do not get a go for 31
        if (sumCards(playedCards) !== 31) {
            logContext.addLog(player, "scored for go", { score: SCORE_GO, go: SCORE_GO });
            addPlayerScore(player, SCORE_GO, game);
        }

        let newPrevious = [...previousPlayedCards, ...playedCards];
        game.previousPlayedCards = newPrevious;
        game.playedCards = [];
        game.players.forEach(player => player.playedCards = []);
    }
    else {
        logContext.addLog(player, "said GO", { score: 0, go: 0 });
    }

    // Go is called when we reach the last player who played a card. Next person to play is the one after this person. 
    return {
        ...game,
        nextToPlay: incrementNextPlayer(game)
    };
}

export function isPlayStageRun(cards: Hand) {
    // order doesn't matter
    let sorted = cards.map(parseRank).sort((a, b) => a - b);
    let last: number | undefined = undefined;
    for (let card of sorted) {
        if (last === undefined || card === last + 1) {
            last = card;
        }
        else {
            return false;
        }
    }

    return true;
}

export function scorePlay(playedCards: Hand, newCard: Card): IScore {
    let score = 0;
    const currentCount = sumCards(playedCards);
    const newCardParsed = parseCard(newCard);
    if (!canPlay(playedCards, newCard)) { throw `Invalid play! Can't play ${newCardParsed.count} when count is already ${currentCount}` }

    // 15
    let fifteen = 0;
    if (currentCount + newCardParsed.count === 15) {
        score += SCORE_PER_FIFTEEN;
        fifteen += SCORE_PER_FIFTEEN;
    }

    // 31
    let thirtyOne = 0;
    if (currentCount + newCardParsed.count === MAX_PLAY_COUNT) {
        score += SCORE_MAX_COUNT;
        thirtyOne += SCORE_MAX_COUNT;
    }

    // Pairs
    const parsedPlayedCards = playedCards.map(parseCard);
    const playedValues = parsedPlayedCards.map(card => card.value);
    let pairCount = 0;
    let pairScore = 0;
    while (playedValues.pop() === newCardParsed.value) {
        pairCount++;
        score += pairCount * SCORE_PER_PAIR;
        pairScore += pairCount * SCORE_PER_PAIR;
    }

    let runs = 0;
    // Runs (In play phase is an unorder contiguous list with no duplicates)
    if (playedCards && playedCards.length > 1) {
        let runLength = 0;
        let checkCards = [];
        let allCards = [...playedCards, newCard];

        while (allCards.length) {
            checkCards.push(allCards.pop()!);
            if (isPlayStageRun(checkCards)) {
                runLength = checkCards.length;
            }
        }

        if (runLength >= 3) {
            console.log(`Run of ${runLength}`);
            score += runLength * SCORE_PER_RUN_CARD;
            runs += runLength * SCORE_PER_RUN_CARD;
        }
    }

    // There are no flushes in pegging
    return { score, runs, fifteen, thirtyOne, pairs: pairScore };
}