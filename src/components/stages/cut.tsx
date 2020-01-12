import React from "react";
import { GameComponent } from "../game";
import { parseCard } from "../../game/card";
import { addPlayerScore } from "../../game/score";
import { PlayLogContext } from "../playLog";
import { getCurrentDealer, WasOrWere } from "../../game/players";

const SCORE_PER_JACK_CUT = 2;

export const Cut: GameComponent = props => {
    const logContext = React.useContext(PlayLogContext);
    const dealer = getCurrentDealer(props.game);
    // Check for jack cut. Points go to the dealer.
    let jackCutScore = 0;
    props.game.cut?.filter(c => parseCard(c).value == "Jack").forEach(() => jackCutScore += SCORE_PER_JACK_CUT);
    addPlayerScore(dealer, jackCutScore, props.game);
    if (jackCutScore > 0) logContext.addLog(dealer, WasOrWere(dealer) + " cut a Jack", { score: jackCutScore, knobs: jackCutScore });
    
    props.setGameState(props.game, true);
    return <div>
        Cutting...
    </div>;
}