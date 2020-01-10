import { Card, parseCard } from "./card";
import { GameState } from "./game";
import { IPlayLogContext } from "../components/playLog";
import { IsYou } from "./players";

export function RunDeal(game: GameState, logContext: IPlayLogContext): GameState {
    const { players, rules } = game;
    const { hands, crib, cut } = deal(players.length, undefined, rules.dealSize, rules.dealerExtra, rules.cribExtra, rules.cutSize);

    return {
        ...game,
        players: players.map((player, i) => ({ ...player, hand: IsYou(player) ? hands[i].sort((a, b) => parseCard(a).rank - parseCard(b).rank) : hands[i] })),
        crib,
        cut,
    };
}

// These are semantically the same, but nice for clarity about the expected size 
// NOTE: No size is enforced other than through checkDeck
export type Deck = Card[];
export type Hand = Card[];

export function createDeck(): Deck {
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
    return shuffle(deck);
}

export function shuffle<T>(items: T[]): T[] {
    const shuffle = items.map(item => ({ item, random: Math.random() }));
    const newItems = [...shuffle].sort((a, b) => {
        if (a.random > b.random) {
            return 1;
        }
        if (a.random == b.random) {
            return 0;
        }
        return -1;
    });

    return newItems.map(wrapper => wrapper.item);
}

export function deal(players = 2, deck?: Deck, handSize = 6, dealerExtra = 0, cribExtra = 0, cutCount = 1) {
    const shuffled = shuffleDeck(deck && deck.length ? deck : createDeck());
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

    // Add extra dealer cards (Dealer is always *last* player to receive card // TODO: This will be by index in the game state )
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