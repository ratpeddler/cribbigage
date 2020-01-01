import React from "react";
import { GameComponent } from "../game";
import { RunDeal } from "../../game/deal";
import { Button } from "../button";
import { IsYou } from "./chooseGameMode";
import { getCurrentDealer } from "../../game/play";

export const Deal: GameComponent = props => {
    const Layout = props.layout;
    let dealer = getCurrentDealer(props.game);
    let yourCrib = IsYou(dealer);

    React.useEffect(() => {
        if (!yourCrib) {
            setTimeout(() => {
                props.setGameState(RunDeal(props.game), true);
            }, 1000);
        }
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