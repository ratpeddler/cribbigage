import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";

export const ScoreStage: GameComponent = props => {
    return <div>
        Cut:
        <Hand cards={props.game.cut!} />

        Scores:
        {props.game.players.map(p => <div key={p.name}>
            <div>{p.name}:</div>
            <HandScore key={p.name} hand={p.hand} cut={props.game.cut} />
            <Hand cards={p.hand} />
        </div>)}
        <Button onClick={() => {
            props.setGameState({
                ...props.game,
                players: props.game.players.map((p, pi) => {
                    const score = scoreHand(p.hand, props.game.cut!);
                    return { ...p, score: p.score + score.score };
                })
            }, true);
        }}>Next</Button>
    </div>;
}