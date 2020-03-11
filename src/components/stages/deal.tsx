import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";
import { PlayLogContext } from "../playLog";
import { playShuffleSound, playDealSound, Repeat } from "../../sounds/playSound";
import { getCurrentDealer, IsYou } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";

export const Deal: GameComponent = props => {
    const logContext = React.useContext(PlayLogContext);
    const [hasRefreshed, setRefreshed] = React.useState(false);

    console.log(props, hasRefreshed);

    const Layout = props.layout;

    let dealer = getCurrentDealer(props.game);
    let yourCrib = IsYou(dealer);

    playShuffleSound();

    React.useEffect(()=>{
        // WARNING: This will cause a re-render. so like don't call it everytime, this should always be treated as an effect?
        // Should we add a HOOK for this to prevent un-intentional re-renders?
        console.log("adding dealer to log context");
        logContext.addLog(dealer, `${IsYou(dealer) ? "are" : "is"} dealer`);
    }, []);

    React.useEffect(() => {
        if (!yourCrib) {
            if (LocalOrMultiplayer == "local") {
                setTimeout(() => {
                    props.setGameState(RunDeal(props.game, logContext), true);
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
                    props.setGameState(RunDeal(props.game, logContext), true);
                    Repeat(playDealSound, 10, 250);
                }}
            >
                {yourCrib ? "Deal" : `${dealer.name} is dealing...`}
            </Button></>} />;
}