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
}

export type ScoreLookup = { [player: string]: IScore };
export interface IScoreContext {
    lookup: ScoreLookup;
    addPlayerScore: (player: PlayerState, score: IScore) => void;
}

export const ScoreContext = React.createContext<IScoreContext>({ lookup: {}, addPlayerScore: () => { } });

export function createScoreMessage(score: IScore) {
    let scoreStrings = [];
    if (score) {
        if (score.fifteen) {
            scoreStrings.push("15 for " + score.fifteen);
        }
        if (score.pairs) {
            scoreStrings.push("pair for " + score.pairs);
        }
        if (score.runs) {
            scoreStrings.push("run for " + score.runs);
        }
        if (score.thirtyOne) {
            scoreStrings.push("31 for " + score.thirtyOne);
        }
        if (score.knobs) {
            scoreStrings.push("knobs for " + score.knobs);
        }
        if (score.flush) {
            scoreStrings.push("flush for " + score.flush);
        }
        if (score.go) {
            scoreStrings.push("go for " + score.go);
        }
    }

    return scoreStrings.join(", ");
}

export const ScoreIcon: React.FC<{ player: PlayerState }> = props => {
    const scoreContext = React.useContext(ScoreContext);
    const logContext = React.useContext(PlayLogContext);
    const score = scoreContext?.lookup[props.player.name];

    let scoreString = createScoreMessage(score);

    let logString: string | null = null;

    // If the last log was the player we can show that instead?
    if (logContext.log[0].startsWith(props.player.name)) {
        console.log("log match!");

        if (!logContext.log[0].includes("played")) {
            // don't show just plays
            logString = logContext.log[0];
        }
    }

    return <div style={{ fontWeight: 700, color: props.player.color, fontSize: 24 }}>
        {score && score.score > 0 ? "+" + scoreString + "!" : logString}
    </div>;
}