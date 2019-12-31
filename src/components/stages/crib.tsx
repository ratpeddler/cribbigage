import React from "react";
import { GameComponent, Game } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";

export const Crib: GameComponent = props => {
    return <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "row" }}>
        <div style={{ flex: "none", padding: "0px 10px", borderRight: "1px solid lightgrey", marginRight: 20 }}>
            <h3>Cut:</h3>
            <Hand cards={props.game.cut!} />
            <div>
                <Button onClick={() => {
                    // last player is always dealer
                    let players = [...props.game.players];
                    let last = players.pop()!;
                    last = {
                        ...last,
                        score: last.score + scoreHand(props.game.crib!, props.game.cut!).score,
                        lastScore: last.score // Strange coincidence :P
                    };

                    players.push(last);
                    if (last.score >= 120) { alert(`${last.name} won!`) }

                    props.setGameState({
                        ...props.game,
                        players
                    }, true);
                }}>Next</Button>
            </div>
        </div>
        <div style={{ flex: "auto" }}>
            <h3>Crib for {props.game.players[props.game.players.length - 1].name}:</h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div><Hand cards={props.game.crib!} /></div>
                <div><HandScore hand={props.game.crib!} cut={props.game.cut} /></div>
            </div>
        </div>
    </div>;
}