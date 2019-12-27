import React from "react";
import { GameState } from "../game/turns";
import { Deal } from "./stages/deal";
import { Throw } from "./stages/throw";
import { Cut } from "./stages/Cut";
import { Play } from "./stages/play";
import { Crib } from "./stages/crib";
import { ScoreStage } from "./stages/scoreStage";

export type GameComponent = React.FC<{ game: GameState }>;

export const Game: GameComponent = props => {
    switch (props.game.stage) {
        case "Deal":
            return <Deal {...props} />;
        case "Throw":
            return <Throw {...props} />;
        case "Cut":
            return <Cut {...props} />;
        case "Play":
            return <Play {...props} />;
        case "Score":
            return <ScoreStage {...props} />;
        case "Crib":
            return <Crib {...props} />;
        default:
            return <>{"No defined stage for " + props.game.stage}</>;
    }
}