import { Hand } from "./deal";
import { Card, parseCard, parseNumericalValue } from "./card";
import { GameState } from "./game";
import { IsYou } from "../components/stages/chooseGameMode";
import { PlayerState } from "./turns";

/** Max play count. A single play cannot exceed this value e.g. 31 */
const MAX_PLAY_COUNT = 31;

/** Score for reaching max play count exaclty (e.g. 31 for 2) */
const SCORE_MAX_COUNT = 2;
const SCORE_PER_FIFTEEN = 2;
const SCORE_PER_PAIR = 2;
const SCORE_PER_RUN_CARD = 1;

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

export function ensureNextPlayer(game: GameState): number {
    if (!game.nextToPlay) {
        console.log("reseting next to play to 0")
        return 0;
    }

    return game.nextToPlay % game.players.length;
}

export function playAI(game: GameState): GameState {
    console.log("ai is playing", game.nextToPlay);

    // Start at the next person who needs to play
    game = { ...game };
    game.nextToPlay = ensureNextPlayer(game);

    while (!IsYou(game.players[ensureNextPlayer(game)])) {
        const { players, playedCards = [], previousPlayedCards = [] } = game;
        game.nextToPlay = ensureNextPlayer(game);
        const player = players[game.nextToPlay];
        const hand = filterHand(player.hand, playedCards, previousPlayedCards);
        console.log("checking if ai can play", hand);

        if (cantPlayAtAll(player, playedCards, previousPlayedCards)) {
            console.log("Ai said GO");
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
    const { players, playedCards = [] } = game;
    let nextToPlay = ensureNextPlayer(game);
    const player = players[nextToPlay];

    if (!canPlay(playedCards, card)) {
        throw `Can't play that! ${card}`;
    }

    game.lastToPlay = nextToPlay;

    console.log("ai can play", card)

    // SCORE
    const playScore = scorePlay(playedCards, card);
    game.playedCards = [...playedCards, card];
    if (playScore) {
        player.lastScore = player.score;
        player.score += playScore;
    }

    nextToPlay++;
    nextToPlay %= players.length;

    // TODO Handle 31 and GO

    return {
        ...game,
        nextToPlay,
    }
}

export function pass(game: GameState): GameState {
    // pass to the next player and check if there has been a GO
    if (game.lastToPlay != undefined && game.nextToPlay === game.lastToPlay) {
        // WE should ensure that that player cannot play either!
        console.log("we have gone around and no one could play!");
        const { previousPlayedCards = [], playedCards = [] } = game;

        // check for 31
        if (sumCards(playedCards) !== 31) {
            // no points for go!

            // ADD 1 to the score of the last to play player.
            game.players[game.lastToPlay].lastScore = game.players[game.lastToPlay].score;
            game.players[game.lastToPlay].score++;
        }

        let newPrevious = [...previousPlayedCards, ...playedCards];
        game.previousPlayedCards = newPrevious;
        game.playedCards = [];
    }

    // After a go, the next to play person is the person AFTER the last to play person. which in this case is the same logic (next person)
    game.nextToPlay = ensureNextPlayer(game);
    game.nextToPlay++;
    game.nextToPlay %= game.players.length;
    return game;
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
        let runLength = 1;
        let max = parseNumericalValue(newCard);
        let min = max;
        let reversed = [...playedCards].reverse();
        for (let card of reversed) {
            const next = parseNumericalValue(card);
            // This fails for some valid play stage runs
            if (next === max + 1) {
                max = next;
                runLength++;
            }
            else if (next === min - 1) {
                min = next
                runLength++;
            }
        }

        if (runLength >= 3) {
            score += runLength * SCORE_PER_RUN_CARD;
        }

        console.log(`Run of ${runLength}, ${min+1} to ${max+1}`);
    }


    // There are no flushes in pegging
    return score;
}