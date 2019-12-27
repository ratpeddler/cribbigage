import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";

export const ScoreStage: GameComponent = props => {
    return <div>
        Cut:
        <Hand cards={props.game.cut!} />
        
        Scores:
        {props.game.players.map(p => <div>
            <div>{p.name}:</div>
            <Hand cards={p.hand} />
            <HandScore key={p.name} hand={p.hand} cut={props.game.cut} />
        </div>)}
        <button onClick={() => props.setGameState(props.game, true)}>Next</button>
    </div>;
}