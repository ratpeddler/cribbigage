import { Card } from "./card";

// These are semantically the same, but nice for clarity about the expected size 
// NOTE: No size is enforced other than through checkDeck
export type Deck = Card[];
export type Hand = Card[];

export function createDeck() : Deck{
    // Create a deck of cards 1-53
    const deck: number[] = [];
    for (let i = 0; i < 52; i++) {
        deck[i] = i;
    }

    // Sanity check that we are not missing any cards
    checkDeck(deck);
    return deck;
}

export function checkDeck(deck: number[]) {
    // Check length
    if (deck.length !== 52) {
        throw "Deck does not have 53 cards!";
    }

    // TODO: Check for duplicates
    //let cardCount: {[card: number]: number} = {};
}

export function shuffleDeck(deck: number[]): Deck {
    const shuffle = deck.map(card => ({ card, random: Math.random() }));
    const newDeck = [...shuffle].sort((a, b) => {
        if (a.random > b.random) {
            return 1;
        }
        if (a.random == b.random) {
            return 0;
        }
        return -1;
    });

    return newDeck.map(wrapper => wrapper.card);
}

export function deal(deck: number[], players = 2, handSize = 6, dealerExtra = 0, cribExtra = 0, cutCount = 1) {
    const shuffled = shuffleDeck(deck);
    checkDeck(shuffled);

    const hands: Hand[] = [];
    const crib: Hand = [];
    const cut: Hand = [];

    // Deal hands
    for (let i = 0; i < handSize; i++) {
        for (let j = 0; j < players; j++) {
            // Init each hand
            if (!hands[j]) {
                hands[j] = [];
            }

            hands[j].push(shuffled.pop()!);
        }
    }

    // Add extra dealer cards (Dealer is always *last* player to receive card)
    for (let i = 0; i < dealerExtra; i++) {
        hands[players - 1].push(shuffled.pop()!);
    }

    // Add extra crib cards
    for (let i = 0; i < cribExtra; i++) {
        crib.push(shuffled.pop()!);
    }

    // Do the cut (Can't take first or last card)
    for (let i = 0; i < cutCount; i++) {
        const cutPoint = Math.floor((Math.random() * (shuffled.length - 2)) + 1);
        cut.push(shuffled[cutPoint]);
    }

    // Return the player hands, the initial crib and the remaining deck (This will need to be cut)
    return { hands, crib, cut };
}