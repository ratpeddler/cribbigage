import React from "react";
import { GameComponent, Game } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { getCurrentDealer, getCurrentPlayer, IsYou } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";
import _ from "lodash";

export const Crib: GameComponent = props => {
    const Layout = props.layout;
    let game = _.cloneDeep(props.game);
    let dealer = getCurrentDealer(game);
    const isYourCrib = IsYou(dealer);

    React.useEffect(() => {
        if (LocalOrMultiplayer == "local" && !isYourCrib) {
            setTimeout(() => {
                addPlayerScore(getCurrentDealer(game), scoreHand(game.crib!, game.cut!).score, game)
                props.setGameState(game, false);
            }, 500);
        }
    }, []);

    const [hasCounted, setHasCounted] = React.useState(LocalOrMultiplayer == "local");

    return <Layout
        setGameState={props.setGameState}
        hideScores
        game={game}
        userActions={() => <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: "auto", textAlign: "center" }}>
                <h3>Crib for <span style={{ color: dealer.color }}>{dealer.name}</span>:</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <div><Hand cards={game.crib!} /></div>
                    <div><HandScore hand={game.crib!} cut={game.cut} /></div>
                </div>
            </div>
            <div style={{ textAlign: "center" }}>
                <Button disabled={!isYourCrib && LocalOrMultiplayer == "online"} onClick={() => {
                    if(LocalOrMultiplayer == "online"){
                        if (!isYourCrib) { throw "can't score the crib if it isn't yours!" }
                        if (!hasCounted) {
                            setHasCounted(true);
                            addPlayerScore(dealer, scoreHand(game.crib!, game.cut!).score, game)
                            props.setGameState(game, false);
                        }
                        else {
                            props.setGameState(game, true);
                        }
                    }
                    else {
                        props.setGameState(game, true);
                    }
                }}>{hasCounted ? "Next" : "Count crib"}</Button>
            </div>
        </div>}
    />;
}