import { parseCard, parseNumericalValue, Suit } from "./card";
import { Hand } from "./deal";
import { PlayerState } from "./players";
import { GameState } from "./game";

const SCORE_FIFTEEN = 2;
const SCORE_PAIR = 2;
const SCORE_KNOBS = 1;
const SCORE_FLUSH_PER_CARD = 1;
const SCORE_RUN_PER_CARD = 1;

/** Min number of cards for a run to score */
const MINIMUM_RUN_LENGTH = 3;

/** Min number of cards to count for a flush. This should probably be hand size */
const MINIMUM_FLUSH_LENGTH = 4;

export function addPlayerScore(player: PlayerState, points: number, maxPoints: number = 120) {
    if (points > 0) {
        player.lastScore = player.score;
        player.score += points;

        if (player.score > maxPoints) {
            alert(player.name + " won!!");
        }
    }
}

export function anyPlayerHasWon(game: GameState) {
    for (let player of game.players) {
        // HACK for now, should be stored in game state
        if (player.score > (game.pointsToWin || 120)) {
            return true;
        }
    }

    return false;
}

/**
 * Scores a normal hand
 * @param hand The player's hand to score
 * @param cut The cut card(s) everyone uses to score
 * @param isCrib whether this is a crib or not (May affect some rules related to flush)
 * TODO: Update rules based on whether it is a crib or not
 */
export function scoreHand(hand: Hand, cut: Hand, isCrib = false) {
    const cards = [...hand, ...cut];

    const fifteen = scoreFifteens(cards);
    const runs = scoreRuns(cards);
    const pairs = scorePairs(cards);
    const flush = scoreFlush(hand, cut, isCrib);
    const knobs = scoreKnobs(hand, cut);

    return {
        score: fifteen + pairs + knobs + runs + flush,
        fifteen,
        pairs,
        knobs,
        runs,
        flush
    };
}

function scoreFifteens(hand: Hand) {
    // NOTE: This will be unoptimized but exhaustive
    // This could easily be N^2... For <10 cards that is still relatively trivial
    let score = 0;

    // All possible sums of the cards
    const sums = allAdditions(hand.map(h => parseCard(h).count));

    // Get only the ones that equal 15 and add them to the score
    sums.filter(sum => sum == 15).forEach(() => score += SCORE_FIFTEEN);

    return score;
}

// This should be basically right, but best to add some unit tests.
export function allAdditions(countValues: number[]): number[] {
    if (countValues && countValues.length) {
        if (countValues.length == 1) {
            return countValues;
        }

        let [x, ...rest] = countValues;
        let otherAdditions = allAdditions(rest);
        return [x, ...otherAdditions, ...otherAdditions.map(v => v + x)];
    }

    return [];
}

function hasFlush(hand: Hand, suit?: Suit) {
    if (hand && hand.length) {
        // If suit isn't provided check the first card
        suit = suit || parseCard(hand[0]).suit;
        for (let card of hand) {
            if (parseCard(card).suit != suit) {
                // no flush unless the full hand is the same suit
                return false;
            }
        }

        return true;
    }

    return false;
}

function scoreFlush(hand: Hand, cut: Hand, isCrib: boolean) {
    if (!hand || hand.length == 0) { return 0; }

    // This could let you say set this to 5, and require both hand and cut flush even when not in crib
    if (hand.length + cut.length < MINIMUM_FLUSH_LENGTH) { return 0; }

    let handHasFlush = hasFlush(hand);
    let cutHasFlush = hasFlush(cut, parseCard(hand[0]).suit);

    if (isCrib) {
        // in the crib you need all cards to be the same suit, hand & cut
        if (handHasFlush && cutHasFlush) {
            return (hand.length + cut.length) * SCORE_FLUSH_PER_CARD;
        }

        return 0;
    }
    else {
        // In normal hand, only the hand has to have a flush, cut is just bonus
        if (handHasFlush) {
            if (cutHasFlush) {
                return (hand.length + cut.length) * SCORE_FLUSH_PER_CARD;
            }

            return hand.length * SCORE_FLUSH_PER_CARD;
        }
    }

    return 0;
}

function scoreRunInner(run: number[]) {
    if (run.length >= MINIMUM_RUN_LENGTH) {
        // Get a total count of all multiples of the run
        let multiples = 1;
        run.forEach(r => multiples *= r);
        return (multiples * run.length) * SCORE_RUN_PER_CARD;
    }

    return 0;
}

function scoreRuns(hand: Hand) {
    if (!hand || hand.length == 0) { return 0; }
    let cards = [...hand];
    let score = 0;

    // sort the hand by raw numerical value. This is by rank and ignores suit.
    cards = cards.map(parseNumericalValue).sort((a, b) => a - b);

    // Look for contiguous sections
    let run: number[] = [];
    let lastNum = -1;
    for (let card of cards) {
        if (lastNum != card && lastNum != card - 1) {
            // Not in a run anymore
            // score the existing run and re initialize
            if (run && run.length > 0) {
                score += scoreRunInner(run);
            }

            // init
            lastNum = card;
            run = [1];

            // We should skip the rest of actions
            continue;
        }

        if (lastNum == card) {
            run[0]++;
        }
        else if (lastNum == card - 1) {
            lastNum = card;
            run.unshift(1); // add to the existing run
        }
    }

    // Score whatever part of the run is remaining
    score += scoreRunInner(run);
    return score;
}

function scorePairs(hand: Hand) {
    if (!hand || hand.length == 0) { return 0; }
    const cards = [...hand];
    let score = 0;
    for (let i = 0; i < hand.length; i++) {
        const currentCard = parseCard(cards.pop()!);
        for (let raw of cards) {
            const otherCard = parseCard(raw);
            if (currentCard.value == otherCard.value) {
                // Pair
                score += SCORE_PAIR;
            }
        }
    }

    return score;
}

function scoreKnobs(hand: Hand, cut: Hand) {
    if (!hand || hand.length == 0) { return 0; }
    let score = 0;
    for (let card of hand) {
        const currentCard = parseCard(card);

        if (currentCard.value == "Jack") {
            for (let cutCard of cut) {
                const otherCard = parseCard(cutCard);
                if (currentCard.suit == otherCard.suit) {
                    // Knobs
                    score += SCORE_KNOBS;
                }
            }
        }
    }

    return score;
}