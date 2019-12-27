import React from "react";
import { PlayerState } from "../game/turns";

export const ScoreBoard: React.FC<{ players: PlayerState[] }> = props => {
    const maxScore = 120;

    const colors = ["blue", "red", "green", "gold"];
    const body: JSX.Element[] = [];
    for (let i = 0; i < maxScore; i++) {
        body.push(<div key={i} style={{ display: "flex", flexDirection: "column" }}>{props.players.map((p, pi) => <ScoreDot key={pi} hasPlayer={p.score == i} playerColor={colors[pi]} />)}</div>);
    }

    return <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        {body}
    </div>;
}

const ScoreDot: React.FC<{ hasPlayer: boolean, playerColor: string }> = props => {
    const diameter = 5;
    return <div style={{ margin: 2, width: diameter, height: diameter, borderRadius: diameter, backgroundColor: props.hasPlayer ? props.playerColor : "grey" }}></div>;
}