
// Card is just a number 0-51.
// This type is not necessary but might be helpful when looking at the code.
// 0 is Ace, 12 is King
// Each suit is N % 13
export type Card = number;

export type Value = "Ace" | "King" | "Queen" | "Jack" | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2;
export type Suit = "Clubs" | "Diamonds" | "Hearts" | "Spades";

/** Parse a card number as the relevant value, suit and count (for 15s) */
export function parseCard(card: Card) {
    const value = parseValue(card);
    return { value, suit: parseSuit(card), count: getCountFromValue(value), rank: parseRank(card) };
}

function getCountFromValue(value: Value): number {
    if (typeof value == "string") {
        if (value == "Ace") {
            return 1;
        }

        return 10;
    }

    return value;
}

/**
 *  Get the raw numberical value 1 (ACE) to 13 (KING)
 *  NOTE: Use @see parseCard for the named rank values
 *  */
export function parseRank(card: Card){
    return (card % 13) + 1;
}

// AKA the card's Rank Value
function parseValue(card: Card): Value {
    // Card is 1-53
    const rawValue = parseRank(card);
    switch (rawValue) {
        case 1:
            return "Ace";
        case 11:
            return "Jack";
        case 12:
            return "Queen";
        case 13:
            return "King";
        default:
            if (rawValue >= 2 && rawValue <= 10) {
                return rawValue as Value;
            }

            throw `Card had invalid numerical value! ${rawValue}`;
    }
}

export function sameSuit(a: Card, b:Card){
    return parseSuit(a) == parseSuit(b);
}

function parseSuit(card: Card): Suit {
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