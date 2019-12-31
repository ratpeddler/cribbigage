import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";

export const ScoreStage: GameComponent = props => {
    return <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "row" }}>
        <div style={{ flex: "none", padding: "0px 10px", marginRight: 20 }}>
            <div>
                <Button onClick={() => {
                    props.setGameState({
                        ...props.game,
                        players: props.game.players.map((p, pi) => {
                            const score = scoreHand(p.hand, props.game.cut!);
                            const newScore = p.score + score.score;
                            if (newScore >= 120) { alert(`${p.name} won!`) }
                            return { ...p, score: newScore, lastScore: p.score };
                        })
                    }, true);
                }}>Next</Button>
            </div>
        </div>
        <div style={{ flex: "auto" }}>
            {props.game.players.map(p => <div key={p.name}>
                <h3>{p.name}:</h3>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div><Hand cards={p.hand} /></div>
                    <div><HandScore key={p.name} hand={p.hand} cut={props.game.cut} /></div>
                </div>


            </div>)}
        </div>

    </div>;
}