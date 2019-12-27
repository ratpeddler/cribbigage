import { Deck, Hand, createDeck } from "./deal";
import { GameState } from "./game";
import { GameRules } from "./rules";

export type Stage = "Deal" | "Throw" | "Cut" | "Play" | "Score" | "Crib";

export type NonGameStages = "ChooseGameMode" | "GameOver";

export const StageOrder: Readonly<Stage[]> = ["Deal", "Throw", "Cut", "Play", "Score", "Crib"];

export interface PlayerInfo {
    name: string;

    // Can add things like USERID etc here in the future or leave as is
}

export interface PlayerState extends PlayerInfo {
    score: number;
    hand: Hand;
}

export function AdvanceGameState(game: GameState): GameState {
    const currentStage = StageOrder.indexOf(game.stage as Stage);
    if (currentStage < 0) {
        throw `Cant use advance game stage from non-game loop stage: ${game.stage}`;
    }

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