import React from "react";
import { GameComponent } from "../game";
import { parseCard } from "../../game/card";
import { addPlayerScore } from "../../game/score";
import { PlayLogContext } from "../playLog";
import { getCurrentDealer, WasOrWere, IsYou, getCurrentCutter } from "../../game/players";
import { Button } from "../button";
import { LocalOrMultiplayer } from "./initAndWait";

const SCORE_PER_JACK_CUT = 2;

export const Cut: GameComponent = props => {
    const logContext = React.useContext(PlayLogContext);
    const Layout = props.layout;
    const { game } = props;
    const currentCutter = getCurrentCutter(game);

    const cut = React.useCallback(() => {
        const dealer = getCurrentDealer(props.game);

        // Check for jack cut. Points go to the dealer.
        let jackCutScore = 0;
        props.game.cut?.filter(c => parseCard(c).value == "Jack").forEach(() => jackCutScore += SCORE_PER_JACK_CUT);
        addPlayerScore(dealer, jackCutScore, props.game);
        if (jackCutScore > 0) logContext.addLog(dealer, WasOrWere(dealer) + " cut a Jack", { score: jackCutScore, knobs: jackCutScore });

        props.setGameState(props.game, true);
    }, [game, props.setGameState]);

    React.useEffect(() => {
        if (!IsYou(currentCutter)) {
            // for local game for now just always cut instantly.
            if (LocalOrMultiplayer == "local") {
                setTimeout(() => {
                    cut();
                }, 500);
            }
            else {
                // multiplayer we should refresh here.
                console.log("refreshing from server, since it is not your turn to CUT.")
                props.refreshFromServer?.();
            }
        }
    }, []);

    return <Layout
        setGameState={props.setGameState}
        game={props.game}
        userActions={() => <div>
            {IsYou(currentCutter) ? <Button big onClick={cut}>Cut</Button> : "waiting for the cut"}
        </div>}
    />;
}