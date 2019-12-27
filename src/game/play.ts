import { GameState } from "./turns";
import { deal, Hand } from "./deal";

export function RunScore(game: GameState): GameState {
    const { players } = game;
    const score = scorePlay(game.playedCards!);

    return {
        ...game,
    };
}

function scorePlay(playedCards: Hand): number {
    
    return 0;
}