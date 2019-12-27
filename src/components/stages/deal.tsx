import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";

export const Deal: GameComponent = props => {
    return <button onClick={() => props.setGameState(RunDeal(props.game))}>Deal</button>;
}