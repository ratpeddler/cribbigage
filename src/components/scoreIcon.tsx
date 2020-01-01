import React from "react";
import { PlayerState } from "../game/players";

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

export const ScoreIcon: React.FC<{ player: PlayerState }> = props => {
    const scoreContext = React.useContext(ScoreContext);
    const score = scoreContext?.lookup[props.player.name];

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

    return <div style={{ fontWeight: 700, color: props.player.color, fontSize: 24 }}>
        {score && score.score > 0 && "+" + scoreStrings.join(", ") + "!"}</div>;
}