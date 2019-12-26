export function createDeck() {
    // Create a deck of cards 1-53
    const deck: number[] = [];
    for (let i = 0; i < 52; i++) {
        deck[i] = i;
    }

    checkDeck(deck);

    return deck;
}

export function checkDeck(deck: number[]) {
    if (deck.length != 52) {
        throw "Deck does not have 53 cards!";
    }
}

export function shuffleDeck(deck: number[]) {
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

export function deal(deck: number[], players = 2, handSize = 6, dealerExtra = 0, cribExtra = 0) {
    const shuffled = shuffleDeck(deck);
    checkDeck(shuffled);

    const hands: number[][] = [];
    const crib: number[] = [];

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
    const cutPoint = ((Math.random() * (shuffled.length - 2)) + 1);
    const cut = shuffled[cutPoint];

    // Return the player hands, the initial crib and the remaining deck (This will need to be cut)
    return { hands, crib, cut };
}

export function parseCard(card: number) {
    return { value: parseValue(card), suit: parseSuit(card) };
}

function parseValue(card: number) {
    // Card is 1-53
    const rawValue = card % 13;
    switch (rawValue) {
        case 0:
            return "Ace";
        case 10:
            return "Jack";
        case 11:
            return "Queen";
        case 12:
            return "King";
        default:
            return rawValue + 1;
    }
}

export type Suit = "Clubs" | "Diamonds" | "Hearts" | "Spades";

function parseSuit(card: number): Suit {
    // Card is 0-52
    const rawSuit = Math.floor(card / 13);
    switch (rawSuit) {
        case 0:
            return "Clubs";
        case 1:
            return "Diamonds";
        case 2:
            return "Hearts";
        case 3:
            return "Spades";
        default:
            throw `Invalid suit! Suit: ${rawSuit}, Card: ${card}`;
    }
}