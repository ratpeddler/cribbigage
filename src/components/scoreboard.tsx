import React from "react";
import { PlayerState } from "../game/turns";

const colors = ["blue", "red", "green", "gold"];
const byPlayerName = (a: PlayerState, b: PlayerState) => {
    if (a.name > b.name) { return 1; }
    if (a.name == b.name) { return 0; }
    return -1;
};

export const ScoreBoard: React.FC<{ players: PlayerState[] }> = props => {
    const players = [...props.players].sort(byPlayerName);
    const maxScore = 120;
    const body: JSX.Element[] = [];

    for (let i = 0; i < maxScore; i++) {
        body.push(<div key={i} style={{ display: "flex", flexDirection: "column", marginTop: 1 }}>
            {players.map((p, pi) => <ScoreDot key={pi} index={i} hasPlayer={p.score == i} playerColor={colors[pi]} />)}
        </div>);
    }

    return <div style={{ display: "flex", flexDirection: "column" }}>
        <Board players={players} total={120} lines={3} />

        <div>
            {players.map((p, pi) => <span
                style={{ color: colors[pi], fontWeight: props.players.indexOf(p) == props.players.length - 1 ? 700 : 400, margin: 5 }}>
                {p.name}: {p.score}
            </span>)}
        </div>
    </div>;
}

const ScoreDot: React.FC<{ hasPlayer: boolean, playerColor: string, index: number }> = props => {
    const diameter = 14;
    return <div title={props.index.toString()} style={{ margin: 2, width: diameter, height: diameter, borderRadius: diameter, backgroundColor: props.hasPlayer ? props.playerColor : "grey" }}></div>;
}

const Board: React.FC<{ players: PlayerState[], total: number, lines: number }> = props => {
    const { total, lines, players } = props;
    const perRow = Math.floor(total / lines);
    if (total / lines != perRow) { throw "Bad choice of line numbers! doesn't divide evenly!" }
    const body: JSX.Element[] = [];
    for (let i = 0; i < lines; i++) {
        body.push(<ScoreRow players={players} dots={perRow} from={perRow * i} reverse={i % 2 != 0} />)
    }
    return <>
        {body}
    </>
}

const ScoreRow: React.FC<{ players: PlayerState[], dots: number, from: number, reverse?: boolean }> = props => {
    const players = [...props.players].sort(byPlayerName);
    const { dots, from, reverse } = props;
    const body: JSX.Element[] = [];

    for (let i = reverse ? dots + from - 1 : from; reverse ? i >= from : i < dots + from; reverse ? i-- : i++) {
        body.push(<div key={i} style={{ display: "flex", flexDirection: "column", marginTop: 1 }}>
            {players.map((p, pi) => <ScoreDot key={pi} index={i} hasPlayer={p.score == i} playerColor={colors[pi]} />)}
        </div>);
    }

    return <div style={{ display: "flex", flexDirection: "row", margin: 5 }}>{body}</div>;
}