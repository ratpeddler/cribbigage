import React from "react";
import { GameComponent, Game } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { getCurrentDealer } from "../../game/play";

export const Crib: GameComponent = props => {
    let game = { ...props.game };
    return <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "row" }}>
        <div style={{ flex: "none", padding: "0px 10px", borderRight: "1px solid lightgrey", marginRight: 20 }}>
            <div>
                <Button onClick={() => {
                    addPlayerScore(getCurrentDealer(game), scoreHand(game.crib!, game.cut!).score)
                    props.setGameState({
                        ...game,
                    }, true);
                }}>Next</Button>
            </div>
        </div>
        <div style={{ flex: "auto" }}>
            <h3>Crib for {game.players[game.players.length - 1].name}:</h3>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div><Hand cards={game.crib!} /></div>
                <div><HandScore hand={game.crib!} cut={game.cut} /></div>
            </div>
        </div>
    </div>;
}