import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";

export const Crib: GameComponent = props => {
    return <div>
        Cut:
        <Hand cards={props.game.cut!} />

        Score of crib:
        <Hand cards={props.game.crib!} />
        <HandScore hand={props.game.crib!} cut={props.game.cut} />

        <button onClick={() => props.setGameState(props.game, true)}>Next</button>
    </div>;
}