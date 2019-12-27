import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";

export const Deal: GameComponent = props => {
    return (
        <Button
            big={true}
            onClick={() => {
                props.setGameState(RunDeal(props.game), true);
            }}
        >
            Deal
        </Button>
    );
}