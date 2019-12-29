import { Hand } from "./deal";
import { Card, parseCard, parseNumericalValue } from "./card";
import { GameState } from "./game";
import { IsYou } from "../components/stages/chooseGameMode";

/** Max play count. A single play cannot exceed this value e.g. 31 */
const MAX_PLAY_COUNT = 31;

/** Score for reaching max play count exaclty (e.g. 31 for 2) */
const SCORE_MAX_COUNT = 2;
const SCORE_PER_FIFTEEN = 2;
const SCORE_PER_PAIR = 2;
const SCORE_PER_RUN_CARD = 1;

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

export function playAI(game: GameState): GameState {
    console.log("ai is playing");

    // Start at the next person who needs to play
    const newGame = { ...game };
    const { players, playedCards = [] } = newGame;
    let { nextToPlay = 0 } = newGame; // this should be the player AFTER the dealer

    let wasGo = !IsYou(players[nextToPlay]);
    while (!IsYou(players[nextToPlay])) {
        const player = players[nextToPlay];
        const { hand } = player;
        console.log("checking if ai can play", hand);

        if (cantPlayAtAll(playedCards, hand)) {
            console.log("Ai couldn't play", playedCards, hand);
            // TODO: Handle GO
            nextToPlay++;
            nextToPlay %= players.length;
            newGame.nextToPlay = nextToPlay;
            continue;
        }

        for (let card of hand) {
            if (canPlay(playedCards, card)) {
                console.log("ai can play", card)
                // cool play the first card
                wasGo = false;

                // SCORE
                const playScore = scorePlay(playedCards, card);
                player.hand = hand.filter(c => c != card);
                newGame.playedCards = [...playedCards, card];
                player.lastScore = player.score;
                player.score += playScore;

                // TODO: move to function and handle go
                nextToPlay++;
                nextToPlay %= players.length;
                newGame.nextToPlay = nextToPlay;

                break;
            }
        }
    }

    if (wasGo) {
        // reset the played cards and give the player a point!
        console.log("AI players couldn't play! This is a go basically? Need to handle scoring");
    }

    return newGame;
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
    if(playedCards && playedCards.length > 0){
        let runLength = 1;
        let max = parseNumericalValue(playedCards[0]);
        let min = max;
        let reversed =[...playedCards].reverse();
        for(let card of reversed){
            const next = parseNumericalValue(card);
            if(next == max + 1){
                max = next;
                runLength++;
            }
            else if(next == min - 1) {
                min = next
                runLength++;
            }
        }

        if(runLength >= 3){
            score += runLength * SCORE_PER_RUN_CARD;
        }

        console.log(`Run of ${runLength}, ${min} to ${max}`);
    }


    // There are no flushes in pegging
    return score;
}