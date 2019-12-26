
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
    return { value, suit: parseSuit(card), count: getCountFromValue(value) };
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

function parseValue(card: Card): Value {
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
            if (rawValue > 1 && rawValue <= 10) {
                return rawValue + 1 as Value;
            }

            throw `Card had invalid raw value! ${rawValue}`;
    }
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