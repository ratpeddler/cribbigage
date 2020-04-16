import React from "react";
import { PlayerState } from "../game/players";
import { GameState } from "../game/game";

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
            scoreStrings.push("Nibs for " + score.knobs);
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

export const ScoreIcon: React.FC<{ game: GameState, player: PlayerState }> = props => {
    // get all logs for the player and check their times!
    let userLogs = React.useMemo(() => (props.game.playLog || [])
        .filter(l => l.score
            && l.playerName == props.player.name
            && l.time > (Date.now() - 2000))
        .slice(0, 4),
        [props.game.playLog]);

    let style = React.useMemo<React.CSSProperties>(() => ({
        fontWeight: 700,
        color: props.player.color,
        fontSize: 24,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%"
    }), [props.player.color]);

    return <div style={style}>
        {userLogs.map(ul => <div className="oldLog" key={ul.time}>
            {createScoreMessage(ul.score!)}
        </div>)}
    </div>;
}