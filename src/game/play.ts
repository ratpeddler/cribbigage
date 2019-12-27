import { GameState } from "./turns";
import { deal, Hand } from "./deal";
import { Card, parseCard } from "./card";

/** Max play count. A single play cannot exceed this value e.g. 31 */
const MAX_PLAY_COUNT = 31;

/** Score for reaching max play count exaclty (e.g. 31 for 2) */
const SCORE_MAX_COUNT = 2;
const SCORE_PER_FIFTEEN = 2;
const SCORE_PER_PAIR = 2;

export function RunScore(game: GameState): GameState {
    const { players } = game;
    //const score = scorePlay(game.playedCards!);

    return {
        ...game,
    };
}

export function sumCards(cards: Hand) {
    let sum = 0;
    cards.forEach(card => sum += parseCard(card).count);
    return sum;
}

export function canPlay(playedCards: Hand | undefined, newCard: Card) {
    if (!playedCards || playedCards.length == 0) { return true; }
    const currentCount = sumCards(playedCards);
    return currentCount + parseCard(newCard).count <= MAX_PLAY_COUNT;
}

export function cantPlayAtAll(playedCards: Hand | undefined, hand: Hand) {
    for (let card of hand) {
        if (canPlay(playedCards, card)) {
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
    if (currentCount + newCardParsed.count == 15) {
        score += SCORE_PER_FIFTEEN;
    }

    // 31
    if (currentCount + newCardParsed.count == MAX_PLAY_COUNT) {
        score += SCORE_MAX_COUNT;
    }

    // Pairs
    const parsedPlayedCards = playedCards.map(parseCard);
    const playedValues = parsedPlayedCards.map(card => card.value);
    let pairs = 0;
    while (playedValues.pop() == newCardParsed.value) {
        pairs++;
        score += pairs * SCORE_PER_PAIR;
    }

    // TODO: Runs

    // TODO: Flushs???

    return score;
}