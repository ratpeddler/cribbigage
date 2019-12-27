import { Deck, Hand, createDeck } from "./deal";

export type Stage = "Deal" | "Throw" | "Cut" | "Play" | "Score" | "Crib";

export const StageOrder: Readonly<Stage[]> = ["Deal", "Throw", "Cut", "Play", "Score", "Crib"];

export interface PlayerInfo {
    name: string;

    // Can add things like USERID etc here in the future or leave as is
}

export interface PlayerState extends PlayerInfo {
    score: number;
    hand: Hand;
}

export interface GameState {
    // List of the players (current dealer is always LAST)
    players: PlayerState[];

    // Current turn number
    turnNumber: number;

    // Current Stage
    stage: Stage;

    // Current Crib
    crib?: Hand;

    // Current Cut
    cut?: Hand;

    // Current played cards
    playedCards?: Hand;
}

export function initGameState(players: PlayerInfo[]): GameState {
    return {
        turnNumber: 0,
        players: players.map(player => ({ ...player, score: 0, hand: [] })),
        stage: "Deal",
        crib: [],
        cut: [],
        playedCards: [],
    }
}

export function AdvanceGameState(game: GameState): GameState {
    const currentStage = StageOrder.indexOf(game.stage);
    const newStage = (currentStage + + 1) % StageOrder.length;
    const stage = StageOrder[newStage];

    if (newStage == 0) {
        let [first, ...rest] = game.players;
        return {
            ...game,
            stage,
            turnNumber: game.turnNumber + 1,
            players: [...rest, first],
            crib: [],
            cut: [],
            playedCards: [],
        }
    }

    return {
        ...game,
        stage,
    }
}