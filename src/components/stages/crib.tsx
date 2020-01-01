import React from "react";
import { GameComponent, Game } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { getCurrentDealer } from "../../game/play";

export const Crib: GameComponent = props => {
    const Layout = props.layout;
    let game = { ...props.game };
    let dealer = getCurrentDealer(game);
    return <Layout
        game={game}
        userActions={() => <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: "auto", textAlign: "center" }}>
                <h3>Crib for <span style={{color: dealer.color}}>{dealer.name}</span>:</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <div><Hand cards={game.crib!} /></div>
                    <div><HandScore hand={game.crib!} cut={game.cut} /></div>
                </div>
            </div>
            <div style={{ textAlign: "center" }}>
                <Button onClick={() => {
                    addPlayerScore(getCurrentDealer(game), scoreHand(game.crib!, game.cut!).score, game)
                    props.setGameState({
                        ...game,
                    }, true);
                }}>Next</Button>
            </div>
        </div>}
    />;
}