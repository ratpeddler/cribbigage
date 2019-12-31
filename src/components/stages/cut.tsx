import React from "react";
import { GameComponent } from "../game";
import { parseCard } from "../../game/card";
import { addPlayerScore } from "../../game/score";
import { getCurrentDealer } from "../../game/play";

const SCORE_PER_JACK_CUT = 2;

export const Cut: GameComponent = props => {
    // Check for jack cuts!
    let jackCutScore = 0;
    props.game.cut?.filter(c => parseCard(c).value == "Jack").forEach(() => jackCutScore += SCORE_PER_JACK_CUT);
    addPlayerScore(getCurrentDealer(props.game), jackCutScore, props.game.rules.pointsToWin);
    props.setGameState(props.game, true);
    return <div>
        Cutting...
    </div>;
}