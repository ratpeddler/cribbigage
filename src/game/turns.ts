import { Deck, Hand, createDeck } from "./deal";

export type Stage = "Deal" | "Throw" | "Cut" | "Play" | "Score" | "Crib";

export const StageOrder: Readonly<Stage[]> = ["Deal" , "Throw" , "Cut" , "Play" , "Score" , "Crib"];

export interface GameState {
    // Current turn number
    turnNumber: number;

    // Current score per user
    score: number[];

    // Current Stage
    stage: Stage;

    // Current Deck
    deck: Deck;

    // Current Hands
    hands?: Hand[];

    // Current Crib
    crib?: Hand;

    // Current Cut
    cut?: Hand;

    // Current played cards
    playedCards?: Hand[];
}

export function initGameState(players: number): GameState{
    return {
        turnNumber: 0,
        score: new Array(players).map(x => (0)),
        stage: "Deal",
        deck: createDeck(),
        hands: [],
        crib: [],
        cut: [],
        playedCards: [],
    }
}