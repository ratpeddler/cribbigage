import { Hand } from "./deal";
import { Card, parseCard, parseNumericalValue } from "./card";
import { GameState } from "./game";
import { IsYou } from "../components/stages/chooseGameMode";
import { PlayerInfo, PlayerState } from "./turns";

/** Max play count. A single play cannot exceed this value e.g. 31 */
const MAX_PLAY_COUNT = 31;

/** Score for reaching max play count exaclty (e.g. 31 for 2) */
const SCORE_MAX_COUNT = 2;
const SCORE_PER_FIFTEEN = 2;
const SCORE_PER_PAIR = 2;
const SCORE_PER_RUN_CARD = 1;

export function filterHand(hand: Hand, playedCards: Hand = [], previousPlayedCards: Hand = []){
    return hand.filter(c => playedCards.indexOf(c) < 0).filter(c => previousPlayedCards.indexOf(c) < 0);
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

export function playAI(game: GameState): GameState {
    console.log("ai is playing", game.nextToPlay);

    // Start at the next person who needs to play
    game = { ...game };
    const { players, playedCards = [], previousPlayedCards = [] } = game;
    if (!game.nextToPlay) {
        console.log("reseting next to play to 0")
        game.nextToPlay = 0;
    }

    console.log("next to play", game.nextToPlay);
    console.log("is you?", IsYou(players[game.nextToPlay]));

    while (!IsYou(players[game.nextToPlay])) {
        const player = players[game.nextToPlay];
        const hand = filterHand(player.hand, playedCards, previousPlayedCards);
        console.log("checking if ai can play", hand);

        if (cantPlayAtAll(player, playedCards, previousPlayedCards)) {
            console.log("Ai couldn't play", playedCards, hand);
            // TODO: Handle GO
            game.nextToPlay++;
            game.nextToPlay %= players.length;
            continue;
        }

        for (let card of hand) {
            if (canPlay(playedCards, card)) {
                game.lastToPlay = game.nextToPlay;
                console.log("ai can play", card)
                // TODO: record last to play

                // SCORE
                const playScore = scorePlay(playedCards, card);
                game.playedCards = [...playedCards, card];
                player.lastScore = player.score;
                player.score += playScore;

                // TODO: move to function and handle go
                game.nextToPlay++;
                game.nextToPlay %= players.length;

                break;
            }
        }
    }

    return game;
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

    // Runs
    if (playedCards && playedCards.length > 0) {
        let runLength = 1;
        let max = parseNumericalValue(playedCards[0]);
        let min = max;
        let reversed = [...playedCards].reverse();
        for (let card of reversed) {
            const next = parseNumericalValue(card);
            if (next == max + 1) {
                max = next;
                runLength++;
            }
            else if (next == min - 1) {
                min = next
                runLength++;
            }
        }

        if (runLength >= 3) {
            console.log(`Run of ${runLength}, ${min} to ${max}`);
            score += runLength * SCORE_PER_RUN_CARD;
        }
    }


    // There are no flushes in pegging
    return score;
}