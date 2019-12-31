import { Hand } from "./deal";
import { Card, parseCard, parseNumericalValue } from "./card";
import { GameState } from "./game";
import { IsYou } from "../components/stages/chooseGameMode";
import { addPlayerScore } from "./score";
import { PlayerState } from "./players";

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

/** Play the AI players NOT A PURE FUNCTION */
export function playAI(game: GameState, autoAdvanceUntilPlayer = false): GameState {
    // Start at the next person who needs to play
    game.nextToPlay = ensureNextPlayer(game);

    let keepRunning = true;
    while (!IsYou(getCurrentPlayer(game)) && keepRunning) {
        if (!autoAdvanceUntilPlayer) { keepRunning = false; }
        game.nextToPlay = ensureNextPlayer(game); // Not sure if needed anymore..

        // Get current player and hand
        const player = getCurrentPlayer(game);
        const hand = getPlayableHand(player, game);
        const { playedCards = [], previousPlayedCards = [] } = game;

        if (cantPlayAtAll(player, playedCards, previousPlayedCards)) {
            console.log(player.name + " said GO");
            game = pass(game);
            continue;
        }

        for (let card of hand) {
            if (canPlay(playedCards, card)) {
                game = playCard(game, card);
                break;
            }
        }
    }

    return game;
}


export function playCard(game: GameState, card: Card): GameState {
    let { playedCards = [] } = game;
    const player = getCurrentPlayer(game);

    if (!canPlay(playedCards, card)) {
        throw `Can't play that! ${card}`;
    }

    game.lastToPlay = ensureNextPlayer(game);

    // SCORE
    const playScore = scorePlay(playedCards, card);
    playedCards = game.playedCards = [...playedCards, card];
    addPlayerScore(player, playScore, game.rules.pointsToWin);

    // Last Card: check if the round is over. If so you get 1 point for last card IFF the count is not 31
    if (playStageOver(game) && sumCards(playedCards) !== 31) {
        addPlayerScore(player, SCORE_LAST_CARD, game.rules.pointsToWin);
    }

    return {
        ...game,
        nextToPlay: incrementNextPlayer(game),
    }
}

export function pass(game: GameState): GameState {
    const player = getCurrentPlayer(game);

    // pass to the next player and check if there has been a GO
    if (game.lastToPlay != undefined && game.nextToPlay === game.lastToPlay) {
        const { previousPlayedCards = [], playedCards = [] } = game;

        // GO: check for 31 since you do not get a go for 31
        if (sumCards(playedCards) !== 31) {
            addPlayerScore(player, SCORE_GO, game.rules.pointsToWin);
        }

        let newPrevious = [...previousPlayedCards, ...playedCards];
        game.previousPlayedCards = newPrevious;
        game.playedCards = [];
    }

    // Go is called when we reach the last player who played a card. Next person to play is the one after this person. 
    return {
        ...game,
        nextToPlay: incrementNextPlayer(game)
    };
}

export function isPlayStageRun(cards: Hand) {
    // order doesn't matter
    let sorted = cards.map(parseNumericalValue).sort((a, b) => a - b);
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

export function scorePlay(playedCards: Hand, newCard: Card): number {
    let score = 0;
    const currentCount = sumCards(playedCards);
    const newCardParsed = parseCard(newCard);
    if (!canPlay(playedCards, newCard)) { throw `Invalid play! Can't play ${newCardParsed.count} when count is already ${currentCount}` }

    // 15
    if (currentCount + newCardParsed.count === 15) {
        score += SCORE_PER_FIFTEEN;
    }

    // 31
    if (currentCount + newCardParsed.count === MAX_PLAY_COUNT) {
        score += SCORE_MAX_COUNT;
    }

    // Pairs
    const parsedPlayedCards = playedCards.map(parseCard);
    const playedValues = parsedPlayedCards.map(card => card.value);
    let pairs = 0;
    while (playedValues.pop() === newCardParsed.value) {
        pairs++;
        score += pairs * SCORE_PER_PAIR;
    }

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
        }
    }

    // There are no flushes in pegging
    return score;
}