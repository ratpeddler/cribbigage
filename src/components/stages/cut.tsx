import React from "react";
import { GameComponent } from "../game";

export const Cut: GameComponent = props => {
    props.setGameState(props.game, true);
    return <div>
        Cutting...
    </div>;
}