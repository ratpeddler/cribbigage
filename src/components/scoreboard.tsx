import React from "react";
import arrow_left from "../arrow_left.png";
import arrow_right from "../arrow_right.png";
import { PlayerState, getPlayerByName } from "../game/players";

const boardColor = "sandybrown";

const byPlayerName = (a: PlayerState, b: PlayerState) => {
    if (a.name > b.name) { return 1; }
    if (a.name === b.name) { return 0; }
    return -1;
};

export const ScoreBoard: React.FC<{ players: PlayerState[], pointsToWin?: number, vertical?: boolean, lines?: number }> = props => {
    const players = [...props.players].sort(byPlayerName);
    const [lastScores, setLastScores] = React.useState(players.map(p => ({ name: p.name, lastScore: p.lastScore } as PlayerState)));
    const [currentScores, setCurrentScores] = React.useState(players.map(p => ({ name: p.name, score: p.score } as PlayerState)));
    const [isMoving, setIsMoving] = React.useState<PlayerState | null>(null);

    let fakedPlayers = players.map(p => ({
        ...p,
        lastScore: getPlayerByName(p.name, lastScores).lastScore,
        score: getPlayerByName(p.name, currentScores).score,
    }));

    React.useEffect(() => {
        let anyUpdates = false;
        // slowly update scores and check if there are any updates needed
        for (let pi = 0; pi < players.length; pi++) {
            const p = players[pi];
            if (p.lastScore > fakedPlayers[pi].lastScore) {
                console.log(`player last score was ${p.lastScore} old last score was ${fakedPlayers[pi].lastScore}`)
                // TODO: how to "leap frog" the scores?
                // count last score -> new last score, then score to score?
                anyUpdates = true;
                setIsMoving(p);
                setTimeout(() => {
                    setLastScores(fakedPlayers.map((lp, li) => {
                        lp = { ...lp };
                        if (li === pi) {
                            // update
                            lp.lastScore++;
                        }

                        return lp;
                    }));
                }, 100);

                break;
            }
            else if (p.score > fakedPlayers[pi].score) {
                console.log(`player score was ${p.score} old score was ${fakedPlayers[pi].score}`)
                anyUpdates = true;
                // TODO: how to "leap frog" the scores?
                // count last score -> new last score, then score to score?
                setIsMoving(p);
                setTimeout(() => {
                    setCurrentScores(fakedPlayers.map((cp, ci) => {
                        cp = { ...cp };
                        if (ci === pi) {
                            // update
                            cp.score++;
                        }

                        return cp;
                    }));
                }, 250);

                break;
            }
        }

        if (!anyUpdates) {
            setTimeout(() => {
                setIsMoving(null);
            }, 250);
        }

    }, [lastScores, currentScores, setLastScores, setCurrentScores, players]);

    return <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="BoardWrapper"
            style={{
                display: "flex",
                flexDirection: props.vertical ? "column" : "row",
                border: `5px solid ${isMoving ? isMoving.color : "transparent"}`,
                padding: 5
            }}>
            <Board players={fakedPlayers} total={props.pointsToWin || 120} lines={props.lines || 3} vertical={props.vertical} />
        </div>

        <div style={{ textAlign: "center" }}>
            {players.map((p, pi) => <span key={pi}
                style={{ color: p.color, fontWeight: props.players.indexOf(p) == props.players.length - 1 ? 700 : 400, margin: 5 }}>
                {p.name}: {p.score}
            </span>)}
        </div>
    </div>;
}

const ScoreDot: React.FC<{ hasPlayer: boolean, playerColor: string, index: number }> = props => {
    const diameter = 5;
    const border = 3;
    return <div
        className="ScoreDot"
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

const Board: React.FC<{ players: PlayerState[], total: number, lines: number, vertical?: boolean }> = props => {
    const { total, lines, players, vertical } = props;

    const perRow = Math.floor(total / lines);
    if (total / lines !== perRow) { throw "Bad choice of line numbers! doesn't divide evenly!" }
    const body: JSX.Element[] = [];
    for (let i = 0; i < lines; i++) {
        body.push(<ScoreRow key={i} players={players} dots={perRow} from={perRow * i} reverse={i % 2 !== 0} vertical={vertical} />)
    }

    return <div className="board" style={{ display: "flex", flexDirection: vertical ? "row" : "column", backgroundColor: boardColor }}>
        {body}
    </div>
}

const ScoreRow: React.FC<{ players: PlayerState[], dots: number, from: number, reverse?: boolean, vertical?: boolean }> = props => {
    const players = [...props.players].sort(byPlayerName);
    const { dots, from, reverse, vertical } = props;
    const body: JSX.Element[] = [];

    for (let i = reverse ? dots + from - 1 : from; reverse ? i >= from : i < dots + from; reverse ? i-- : i++) {
        body.push(<div
            className="ScoreRowInner"
            key={i}
            style={{
                display: "flex",
                flexDirection: vertical ? "row" : "column",
                marginTop: 1,
                outline: i % 30 === 0 ? "2px solid yellow" : i % 5 === 0 ? "1px solid black" : undefined
            }}>
            {players.map((p, pi) => <ScoreDot key={pi} index={i} hasPlayer={p.score === i || p.lastScore === i} playerColor={p.color} />)}
        </div>);
    }

    return <div className="ScoreRow" style={{ display: "flex", flexDirection: vertical ? "column" : "row", margin: 5 }}>{body}</div>;
}