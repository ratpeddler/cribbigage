import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { getCurrentDealer, IsYou } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";
import _ from "lodash";

export const Crib: GameComponent = props => {
    const [hasCounted, setHasCounted] = React.useState(false);
    const Layout = props.layout;
    let game = _.cloneDeep(props.game);
    let dealer = getCurrentDealer(game);
    const isYourCrib = IsYou(dealer);

    const Action_ScoreCrib = () => {
        if (hasCounted) { throw "You already counted the crib!"; }
        addPlayerScore(dealer, scoreHand(game.crib!, game.cut!).score, game);
        props.setGameState(game, false);
        setHasCounted(true);
    }

    const Action_GoToNextDeal = () => {
        if (!hasCounted) { throw "You didn't count the crib yet!"; }
        props.setGameState(game, true);
    }

    const [hasRefreshed, setRefreshed] = React.useState(false);
    React.useEffect(() => {
        if (!isYourCrib) {
            if (LocalOrMultiplayer == "local") {
                setTimeout(Action_ScoreCrib, 500);
            }
            else if (!hasRefreshed) {
                setRefreshed(true);
                // multiplayer we should refresh here.
                console.log("refreshing from server, since it is not your turn to COUNT THE CRIB.")
                props.refreshFromServer?.();
            }
        }
    }, []);

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
                {hasRefreshed && props.refreshFromServer && <Button disabled={props.waitingForServer} onClick={props.refreshFromServer}>Next</Button>}
                <Button disabled={!isYourCrib || hasCounted} onClick={Action_ScoreCrib}>Count crib</Button>
                <Button disabled={!hasCounted} onClick={Action_GoToNextDeal}>Go to next deal</Button>
            </div>
        </div>}
    />;
}