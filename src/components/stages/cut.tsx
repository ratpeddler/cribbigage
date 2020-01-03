import React from "react";
import { GameComponent } from "../game";
import { parseCard } from "../../game/card";
import { addPlayerScore } from "../../game/score";
import { getCurrentDealer } from "../../game/play";
import { PlayLogContext } from "../playLog";

const SCORE_PER_JACK_CUT = 2;

export const Cut: GameComponent = props => {
    const logContext = React.useContext(PlayLogContext);
    // Check for jack cut. Points go to the dealer.
    let jackCutScore = 0;
    props.game.cut?.filter(c => parseCard(c).value == "Jack").forEach(() => jackCutScore += SCORE_PER_JACK_CUT);
    addPlayerScore(getCurrentDealer(props.game), jackCutScore, props.game);
    logContext.addLog(getCurrentDealer(props.game), "was cut a Jack", { score: jackCutScore, knobs: jackCutScore });
    props.setGameState(props.game, true);
    return <div>
        Cutting...
    </div>;
}