import React from "react";
import { Deal } from "./stages/deal";
import { Throw } from "./stages/throw";
import { Cut } from "./stages/cut";
import { Play } from "./stages/play";
import { Crib } from "./stages/crib";
import { ScoreStage } from "./stages/scoreStage";
import { GameState } from "../game/game";
import { LayoutProps } from "./layouts/Horizontal_2Player";
import { CreateGame } from "./stages/createGame";
import { GameSummary } from "./stages/gamesummary";
import { InitAndWait } from "./stages/initAndWait";

export type SetGameState = (gameState: GameState, advance: boolean) => void;

export interface GameComponentProps {
    game: GameState,
    setGameState: SetGameState,
    layout: React.FC<LayoutProps>,
    waitingForServer?: boolean
};

export type GameComponent = React.FC<GameComponentProps>;

export const Game: GameComponent = props => {
    switch (props.game.stage) {
        case "InitAndWait":
            return <InitAndWait {...props} />;
        case "CreateGame":
            return <CreateGame {...props} />;
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