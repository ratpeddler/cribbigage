import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";

export const ScoreStage: GameComponent = props => {
    const Layout = props.layout;
    return <Layout
        game={props.game}
        userActions={() => <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: "auto", overflow: "auto", display: "flex", flexDirection: "column" }}>
                {props.game.players.map(p => <div key={p.name} style={{ textAlign: "center" }} >
                    <h3>{p.name}:</h3>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                        <div><Hand cards={p.hand} /></div>
                        <div><HandScore key={p.name} hand={p.hand} cut={props.game.cut} /></div>
                    </div>


                </div>)}
            </div>
            <div style={{ textAlign: "center" }}>
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
        }
    />;
}