import React from "react";
import { PlayerState } from "../game/players";
import { PlayLogContext } from "./playLog";

export interface IScore {
    score: number,
    fifteen?: number,
    pairs?: number,
    runs?: number,
    flush?: number,
    knobs?: number,
    thirtyOne?: number,
    go?: number,
    lastCard?: number,
}

export function createScoreMessage(score: IScore) {
    let scoreStrings = [];
    if (score) {
        if (score.fifteen) {
            scoreStrings.push("15 for " + score.fifteen);
        }
        if (score.pairs) {
            scoreStrings.push("Pair for " + score.pairs);
        }
        if (score.runs) {
            scoreStrings.push("Run for " + score.runs);
        }
        if (score.thirtyOne) {
            scoreStrings.push("31 for " + score.thirtyOne);
        }
        if (score.knobs) {
            scoreStrings.push("Knobs for " + score.knobs);
        }
        if (score.flush) {
            scoreStrings.push("Flush for " + score.flush);
        }
        if (score.lastCard) {
            scoreStrings.push("Last card for " + score.lastCard);
        }
        if (score.go) {
            scoreStrings.push("Go for " + score.go);
        }
        if (score.go === 0) {
            scoreStrings.push("GO");
        }
    }

    return scoreStrings.join(", ");
}

export const ScoreIcon: React.FC<{ player: PlayerState }> = props => {
    const logContext = React.useContext(PlayLogContext);

    // get all logs for the player and check their times!
    let userLogs = logContext.log
        .filter(l => l.score && l.playerName == props.player.name && l.time > (Date.now() - 4000))
        .slice(0, 4).map(l => ({ time: l.time, text: createScoreMessage(l.score!) }));

    return <div style={{ fontWeight: 700, color: props.player.color, fontSize: 24 }}>
        {userLogs.map(ul => <div className="oldLog" key={ul.time}>
            {ul.text}
        </div>)}
    </div>;
}