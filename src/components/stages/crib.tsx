import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";

export const Crib: GameComponent = props => {
    return <div>
        Cut:
        <Hand cards={props.game.cut!} />

        Score of crib:
        <Hand cards={props.game.crib!} />
        <HandScore hand={props.game.crib!} cut={props.game.cut} />

        <Button onClick={() => props.setGameState(props.game, true)}>Next</Button>
    </div>;
}