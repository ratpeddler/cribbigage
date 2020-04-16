import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";
import { playShuffleSound, playDealSound, Repeat } from "../../sounds/playSound";
import { getCurrentDealer, IsYou } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";
import { addLog } from "../../App";

export const Deal: GameComponent = props => {
    const [hasRefreshed, setRefreshed] = React.useState(false);

    console.log(props, hasRefreshed);

    const Layout = props.layout;

    let dealer = getCurrentDealer(props.game);
    let yourCrib = IsYou(dealer);

    playShuffleSound();

    React.useEffect(() => {
        if (!yourCrib) {
            if (LocalOrMultiplayer == "local") {
                setTimeout(() => {
                    addLog(props.game, dealer, "is dealer");
                    props.setGameState(RunDeal(props.game), true);
                    Repeat(playDealSound, 10, 250);
                }, 1000);
            }
            else if (!hasRefreshed) {
                console.log("refreshing from server, since it is not your turn to DEAL.")
                setRefreshed(true);
                // multiplayer we should refresh here.
                props.refreshFromServer?.();
            }
        }
    }, [hasRefreshed]);

    // TODO: Animate dealing

    return <Layout game={props.game} setGameState={props.setGameState} userActions={() =>
        <>
            {yourCrib && <h3>It's <span style={{ color: dealer.color }}>your</span> turn to deal</h3>}
            <Button
                disabled={!yourCrib}
                loading={!yourCrib}
                big={true}
                onClick={() => {
                    addLog(props.game, dealer, "is dealer");
                    props.setGameState(RunDeal(props.game), true);
                    Repeat(playDealSound, 10, 250);
                }}
            >
                {yourCrib ? "Deal" : `${dealer.name} is dealing...`}
            </Button></>} />;
}