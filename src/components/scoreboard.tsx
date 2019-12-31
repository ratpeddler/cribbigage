import React from "react";
import arrow_left from "../arrow_left.png";
import arrow_right from "../arrow_right.png";
import { PlayerState } from "../game/players";

const boardColor = "sandybrown";

const colors = ["blue", "red", "green", "gold"];
const byPlayerName = (a: PlayerState, b: PlayerState) => {
    if (a.name > b.name) { return 1; }
    if (a.name === b.name) { return 0; }
    return -1;
};

export const ScoreBoard: React.FC<{ players: PlayerState[], pointsToWin?: number }> = props => {
    const players = [...props.players].sort(byPlayerName);
    return <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
            <img src={arrow_left} height={150} />
            <Board players={players} total={props.pointsToWin || 120} lines={3} />
            <img src={arrow_right} height={150} />
        </div>

        <div style={{ textAlign: "center" }}>
            {players.map((p, pi) => <span key={pi}
                style={{ color: colors[pi], fontWeight: props.players.indexOf(p) == props.players.length - 1 ? 700 : 400, margin: 5 }}>
                {p.name}: {p.score}
            </span>)}
        </div>
    </div>;
}

const ScoreDot: React.FC<{ hasPlayer: boolean, playerColor: string, index: number }> = props => {
    const diameter = 10;
    const border = 4;
    return <div
        title={props.index.toString()}
        style={{
            margin: 2,
            width: diameter,
            height: diameter,
            borderRadius: diameter,
            backgroundColor: props.hasPlayer ? props.playerColor : "grey",
            border: `${border}px solid ${props.hasPlayer ? props.playerColor : boardColor}`,
        }}></div>;
}

const Board: React.FC<{ players: PlayerState[], total: number, lines: number }> = props => {
    const { total, lines, players } = props;
    const perRow = Math.floor(total / lines);
    if (total / lines !== perRow) { throw "Bad choice of line numbers! doesn't divide evenly!" }
    const body: JSX.Element[] = [];
    for (let i = 0; i < lines; i++) {
        body.push(<ScoreRow key={i} players={players} dots={perRow} from={perRow * i} reverse={i % 2 !== 0} />)
    }
    return <div style={{ display: "flex", flexDirection: "column", backgroundColor: boardColor }}>
        {body}
    </div>
}

const ScoreRow: React.FC<{ players: PlayerState[], dots: number, from: number, reverse?: boolean }> = props => {
    const players = [...props.players].sort(byPlayerName);
    const { dots, from, reverse } = props;
    const body: JSX.Element[] = [];

    for (let i = reverse ? dots + from - 1 : from; reverse ? i >= from : i < dots + from; reverse ? i-- : i++) {
        body.push(<div
            key={i}
            style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 1,
                outline: i % 30 === 0 ? "2px solid yellow" : i % 5 === 0 ? "1px solid black" : undefined
            }}>
            {players.map((p, pi) => <ScoreDot key={pi} index={i} hasPlayer={p.score === i || p.lastScore === i} playerColor={colors[pi]} />)}
        </div>);
    }

    return <div style={{ display: "flex", flexDirection: "row", margin: 5 }}>{body}</div>;
}