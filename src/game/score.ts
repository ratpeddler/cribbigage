import { parseCard } from "./card";

const SCORE_PAIR = 2;
const SCORE_KNOBS = 1;

/**
 * Scores a normal hand
 * @param hand The player's hand to score
 * @param cut The cut card(s)
 * @param isCrib whether this is a crib or not (May affect some rules related to flush)
 * TODO: Update rules based on whether it is a crib or not
 */
export function scoreHand(hand: number[], cut: number[], isCrib = false) {
    let score = 0;
    const totalLength = hand.length + cut.length;
    // NOTE: This will be unoptimized but exhaustive
    // 15's 

    // Runs

    // Pairs
    const allCards = [...hand, ...cut];
    for (let i = 0; i < totalLength; i++) {
        const currentCard = parseCard(allCards.pop()!);
        for (let raw of allCards) {
            const otherCard = parseCard(raw);
            if (currentCard.value == otherCard.value) {
                // Pair is 2 points
                score += SCORE_PAIR;
            }
        }
    }

    // Flushs

    // Knobs
    for (let card of hand) {
        const currentCard = parseCard(card);
        if(currentCard.value == "Jack"){
            for(let cutCard of cut){
                const otherCard = parseCard(cutCard);
                if(currentCard.suit == otherCard.suit){
                    // Knobs
                    score += SCORE_KNOBS;
                }
            }
        }
    }
}