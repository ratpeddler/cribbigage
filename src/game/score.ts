import { parseCard } from "./card";
import { Hand } from "./deal";

const SCORE_FIFTEEN = 2;
const SCORE_PAIR = 2;
const SCORE_KNOBS = 1;

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
    const pairs = scorePairs(cards);
    const knobs = scoreKnobs(hand, cut);

    // TODO: Runs
    const runs = 0;

    // TODO: Flushs
    const flush = 0;

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

    // All possible sums of the cards (This should be close. Best to add unit tests...)
    const sums = allAdditions(hand.map(h => parseCard(h).count));

    // Get only the ones that equal 15 and add them to the score
    sums.filter(sum => sum == 15).forEach(() => score += SCORE_FIFTEEN);

    return score;
}

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


function scorePairs(hand: Hand) {
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