import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";
import { PlayLogContext } from "../playLog";
import { playShuffleSound, playDealSound, Repeat } from "../../sounds/playSound";
import { getCurrentDealer, IsYou } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";

export const Deal: GameComponent = props => {
    const Layout = props.layout;
    const logContext = React.useContext(PlayLogContext);

    let dealer = getCurrentDealer(props.game);
    let yourCrib = IsYou(dealer);

    playShuffleSound();

    React.useEffect(() => {
        if (LocalOrMultiplayer == "local" && !yourCrib) {
            setTimeout(() => {
                props.setGameState(RunDeal(props.game, logContext), true);
                Repeat(playDealSound, 10, 250);
            }, 1000);
        }

        logContext.addLog(dealer, `${IsYou(dealer) ? "are" : "is"} dealer`);
    }, []);

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