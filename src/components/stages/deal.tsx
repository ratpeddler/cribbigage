import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";
import { IsYou } from "./chooseGameMode";
import { getCurrentDealer } from "../../game/play";
import { PlayLogContext } from "../playLog";

export const Deal: GameComponent = props => {
    const Layout = props.layout;
    const logContext = React.useContext(PlayLogContext);

    let dealer = getCurrentDealer(props.game);
    let yourCrib = IsYou(dealer);

    React.useEffect(() => {
        if (!yourCrib) {
            setTimeout(() => {
                props.setGameState(RunDeal(props.game), true);
            }, 1000);
        }

        logContext.addLog(dealer, "is dealer");
    }, []);

    // TODO: Animate dealing

    return <Layout game={props.game} userActions={() =>
        <>
            {yourCrib && <h3>It's your turn to deal</h3>}
            <Button
                disabled={!yourCrib}
                loading={!yourCrib}
                big={true}
                onClick={() => {
                    props.setGameState(RunDeal(props.game), true);
                }}
            >
                {yourCrib ? "Deal" : `${dealer.name} is dealing...`}
            </Button></>} />;
}