import React from "react";
import { GameComponent, Game } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { getCurrentDealer } from "../../game/play";

export const Crib: GameComponent = props => {
    let game = { ...props.game };
    return <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "auto", textAlign: "center" }}>
            <h3>Crib for {game.players[game.players.length - 1].name}:</h3>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div><Hand cards={game.crib!} /></div>
                <div><HandScore hand={game.crib!} cut={game.cut} /></div>
            </div>
        </div>
        <div style={{ textAlign: "center" }}>
            <Button onClick={() => {
                addPlayerScore(getCurrentDealer(game), scoreHand(game.crib!, game.cut!).score, game.rules.pointsToWin)
                props.setGameState({
                    ...game,
                }, true);
            }}>Next</Button>
        </div>
    </div>;
}