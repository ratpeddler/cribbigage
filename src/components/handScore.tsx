import React from "react";
import { scoreHand } from "../game/score";
import { Hand } from "../game/deal";

export const HandScore: React.FC<{ hand: Hand, cut?: Hand }> = props => {
    const { hand, cut = [] } = props;
    const score = scoreHand(hand, cut);
    return <div>
        {/* Display the scores for now while finishing scoring */}
        <div>SCORE: {score.score}</div>
        {!!score.fifteen && <div>fifteen: {score.fifteen}</div>}
        {!!score.pairs && <div>pairs: {score.pairs}</div>}
        {!!score.knobs && <div>knobs: {score.knobs}</div>}
        {!!score.runs && <div>runs: {score.runs}</div>}
        {!!score.flush && <div>flush: {score.flush}</div>}
    </div>
}