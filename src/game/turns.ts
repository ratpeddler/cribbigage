import { GameState } from "./game";

export type Stage = "Deal" | "Throw" | "Cut" | "Play" | "Score" | "Crib";

export type NonGameStages = "CreateGame" | "GameOver";

export const StageOrder: Readonly<Stage[]> = ["Deal", "Throw", "Cut", "Play", "Score", "Crib"];

export function isGameStage(game: GameState) {
    return StageOrder.indexOf(game.stage as Stage) >= 0;
}

export function AdvanceGameState(game: GameState): GameState {
    const currentStage = StageOrder.indexOf(game.stage as Stage);
    if (currentStage < 0) {
        throw `Cant use advance game stage from non-game loop stage: ${game.stage}`;
    }

    const newStage = (currentStage + 1) % StageOrder.length;
    const stage = StageOrder[newStage];

    if (newStage == 0) {
        let [first, ...rest] = game.players.map(player => {
            player.playedCards = [];
            player.hand = [];
            return player;
        });
        return {
            ...game,
            stage,
            turnNumber: game.turnNumber + 1,
            players: [...rest, first],
            crib: [],
            cut: [],
            playedCards: [],
            previousPlayedCards: [],
            nextToPlay: 0,
            lastToPlay: undefined,
        }
    }

    return {
        ...game,
        stage,
    }
}