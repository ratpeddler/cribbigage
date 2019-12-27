import React from "react";
import { PlayerState } from "../game/turns";

export const ScoreBoard: React.FC<{ players: PlayerState[] }> = props => {
    const players = [...props.players].sort((a, b) => {
        if (a.name > b.name) { return 1; }
        if (a.name == b.name) { return 0; }
        return -1;
    });

    const maxScore = 120;
    const colors = ["blue", "red", "green", "gold"];
    const body: JSX.Element[] = [];

    for (let i = 0; i < maxScore; i++) {
        body.push(<div key={i} style={{ display: "flex", flexDirection: "column", marginTop: 1 }}>
            {players.map((p, pi) => <ScoreDot key={pi} hasPlayer={p.score == i} playerColor={colors[pi]} />)}
        </div>);
    }

    return <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14 }}>
            {players.map((p, pi) => <div style={{ fontWeight: props.players.indexOf(p) == props.players.length - 1 ? 700 : 400 }}>{p.name}:{p.score}</div>)}
        </div>
        {body}
    </div>;
}

const ScoreDot: React.FC<{ hasPlayer: boolean, playerColor: string }> = props => {
    const diameter = 14;
    return <div style={{ margin: 2, width: diameter, height: diameter, borderRadius: diameter, backgroundColor: props.hasPlayer ? props.playerColor : "grey" }}></div>;
}