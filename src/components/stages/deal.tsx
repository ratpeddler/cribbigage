import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";
import { getCurrentDealer, IsYou } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";
import { addLog } from "../../App";
import { playShuffleSound } from "../../sounds/playSound";

export const Deal: GameComponent = props => {
    //const [hasRefreshed, setRefreshed] = React.useState(false);
    //console.log(props, hasRefreshed);

    const Layout = props.layout;

    let dealer = getCurrentDealer(props.game);
    let yourCrib = IsYou(dealer);

    React.useEffect(playShuffleSound, []);

    React.useEffect(() => {
        if (!yourCrib) {
            if (LocalOrMultiplayer == "local") {
                setTimeout(() => {
                    console.log("local not your crib deal");
                    addLog(props.game, dealer, "is dealer", "Deal");
                    props.setGameState(RunDeal(props.game), true);
                }, 1000);
            }
            else {
                setTimeout(() => {
                    // multiplayer we should refresh here.
                    props.refreshFromServer?.();
                }, 1000);
            }
        }
    }, []);

    // TODO: Animate dealing

    return <Layout game={props.game} setGameState={props.setGameState} userActions={() =>
        <>
            {yourCrib && <h3>It's <span style={{ color: dealer.color }}>your</span> turn to deal</h3>}
            {!yourCrib && props.refreshFromServer && <Button disabled={props.waitingForServer} onClick={props.refreshFromServer}>Next</Button>}
            <Button
                disabled={!yourCrib}
                loading={!yourCrib}
                big={true}
                onClick={() => {
                    console.log("you clicked deal");
                    addLog(props.game, dealer, "is dealer", "Deal");
                    props.setGameState(RunDeal(props.game), true);
                }}
            >
                {yourCrib ? "Deal" : `${dealer.name} is dealing...`}
            </Button></>} />;
}