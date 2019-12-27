import React from "react";
import { GameState, AdvanceGameState } from "../game/turns";
import { Deal } from "./stages/deal";
import { Throw } from "./stages/throw";
import { Cut } from "./stages/cut";
import { Play } from "./stages/play";
import { Crib } from "./stages/crib";
import { ScoreStage } from "./stages/scoreStage";

type GameComponentProps = { game: GameState, setGameState: (gameState: GameState) => void };
export type GameComponent = React.FC<GameComponentProps>;

export const Game: GameComponent = props => {
    // Wrap the setGameState call so that we always advance the game state correctly
    const stageProps: GameComponentProps = {
        ...props, 
        setGameState: newState => {
            props.setGameState(AdvanceGameState(newState));
    }};

    switch (props.game.stage) {
        case "Deal":
            return <Deal {...stageProps} />;
        case "Throw":
            return <Throw {...stageProps} />;
        case "Cut":
            return <Cut {...stageProps} />;
        case "Play":
            return <Play {...stageProps} />;
        case "Score":
            return <ScoreStage {...stageProps} />;
        case "Crib":
            return <Crib {...stageProps} />;
        default:
            return <>{"No defined stage for " + props.game.stage}</>;
    }
}