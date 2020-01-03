import React from "react";
import { PlayerState, getPlayerByName } from "../game/players";
import _ from "lodash";
import { createStraightSegment, createTrack, create90Segment, SimpleDot, create180Segment, createSpacer, getTrackBounds } from "./track";

const boardColor = "sandybrown";
let x = createStraightSegment(1, 1, 1);

const byPlayerName = (a: PlayerState, b: PlayerState) => {
    if (a.name > b.name) { return 1; }
    if (a.name === b.name) { return 0; }
    return -1;
};

const testplayers = 3;

const startArea = createStraightSegment(50, 50, testplayers, 3);
const block = createStraightSegment(70, 50, testplayers);
const weirdcurveR = createSpacer(5, Math.PI / 17);
const weirdcurveL = createSpacer(5, Math.PI / -17);

const def = [
    startArea,
    weirdcurveL,
    block,
    weirdcurveR,
    block,
    create180Segment(70, 50, testplayers),
    createStraightSegment(70, 50, testplayers),
    createSpacer(5, -1 * Math.PI / 17),
    createStraightSegment(70, 50, testplayers),
    createSpacer(5, -1 * Math.PI / 17),
    create180Segment(70, 50, testplayers, true),
    createStraightSegment(70, 50, testplayers),
    createSpacer(5, Math.PI / 17),
    createStraightSegment(70, 50, testplayers),
    createSpacer(5, Math.PI / 17),
    create90Segment(70, 50, testplayers, true),
    createSpacer(15, 0),
    create90Segment(70, 50, testplayers, true),
    createStraightSegment(70, 50, testplayers),
    createStraightSegment(35, 50, 1, 1),
];

const dots = createTrack(def);

console.log(getTrackBounds(dots));

export const ScoreBoard: React.FC<{ players: PlayerState[], pointsToWin?: number, vertical?: boolean, lines?: number }> = props => {
    const turnOrderPlayers = _.cloneDeep(props.players);
    const boardOrderPlayers = _.cloneDeep(props.players).sort(byPlayerName);
    const [lastScores, setLastScores] = React.useState(boardOrderPlayers.map(p => ({ name: p.name, lastScore: p.lastScore } as PlayerState)));
    const [currentScores, setCurrentScores] = React.useState(boardOrderPlayers.map(p => ({ name: p.name, score: p.score } as PlayerState)));
    const [isMoving, setIsMoving] = React.useState<PlayerState | null>(null);

    let fakedPlayers = boardOrderPlayers.map(p => ({
        ...p,
        lastScore: getPlayerByName(p.name, lastScores).lastScore,
        score: getPlayerByName(p.name, currentScores).score,
    } as PlayerState));

    React.useEffect(() => {
        // Run updates in turn order of players
        let anyUpdates = false;
        for (let p of turnOrderPlayers) {
            if (p.lastScore > fakedPlayers.find(fp => fp.name == p.name)!.lastScore) {
                //console.log(`player last score was ${p.lastScore} old last score was ${fakedPlayers[pi].lastScore}`)
                // TODO: how to "leap frog" the scores?
                // count last score -> new last score, then score to score?
                anyUpdates = true;
                setIsMoving(p);
                setTimeout(() => {
                    setLastScores(fakedPlayers.map((lp) => {
                        lp = { ...lp };
                        if (lp.name === p.name) {
                            // update
                            lp.lastScore++;
                        }

                        return lp;
                    }));
                }, 100);

                break;
            }
            else if (p.score > fakedPlayers.find(fp => fp.name == p.name)!.score) {
                //console.log(`player score was ${p.score} old score was ${fakedPlayers[pi].score}`)
                anyUpdates = true;
                // TODO: how to "leap frog" the scores?
                // count last score -> new last score, then score to score?
                setIsMoving(p);
                setTimeout(() => {
                    setCurrentScores(fakedPlayers.map(cp => {
                        cp = { ...cp };
                        if (cp.name === p.name) {
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

    }, [lastScores, currentScores, setLastScores, setCurrentScores, props.players]);

    return <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
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
            {boardOrderPlayers.map((p, pi) => <span key={pi}
                style={{ color: p.color, fontWeight: props.players.indexOf(p) == props.players.length - 1 ? 700 : 400, margin: 5 }}>
                {p.name}: {p.score}
            </span>)}
        </div>
    </div>;
}

const ScoreDot: React.FC<{ hasPlayer: boolean, playerColor: string, index: number }> = props => {
    const diameter = 5;
    const border = 2;
    return <div
        className="ScoreDot"
        title={props.index.toString()}
        style={{
            margin: 1,
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
        body.push(<ScoreRow
            key={i}
            players={players}
            dots={i == lines - 1 ? perRow + 1 : perRow}
            from={perRow * i + 1}
            reverse={i % 2 !== 0}
            vertical={vertical}
            pad={i !== 0 && i !== lines - 1}
        />)
    }

    return <div className="board" style={{ display: "flex", flexDirection: vertical ? "row" : "column", backgroundColor: boardColor }}>
        {body}
    </div>
}

const ScoreRow: React.FC<{ players: PlayerState[], dots: number, from: number, reverse?: boolean, vertical?: boolean, pad?: boolean }> = props => {
    const { from, vertical, pad } = props;

    return <div className="ScoreRow" style={{ display: "flex", flexDirection: vertical ? "column" : "row", margin: 5, justifyContent: "center" }}>
        {from == 1 ? <StraightSegment {...props} from={0} dots={1} /> : (pad && <div style={{ height: 17 }}></div>)}
        <StraightSegment {...props} />
    </div>;
}

const StraightSegment: React.FC<{ players: PlayerState[], dots: number, from: number, reverse?: boolean, vertical?: boolean }> = props => {
    const players = [...props.players].sort(byPlayerName);
    const { dots, from, reverse, vertical } = props;
    const body: JSX.Element[] = [];

    for (let i = reverse ? dots + from - 1 : from; reverse ? i >= from : i < dots + from; reverse ? i-- : i++) {
        const borderColor = (i !== 0 && (i === 90 || i === 60)) ? "1px solid yellow" : (i % 5 === 0 ? "1px solid black" : "1px solid transparent");
        body.push(<div
            className="ScoreRowInner"
            key={i}
            style={{
                display: "flex",
                flexDirection: vertical ? "row" : "column",
                marginTop: 1,
                borderBottom: !reverse && vertical ? borderColor : undefined,
                borderTop: reverse && vertical ? borderColor : undefined,
                borderRight: !vertical ? borderColor : undefined,
            }}>
            {players.map((p, pi) => <ScoreDot key={pi} index={i} hasPlayer={p.score === i || p.lastScore === i} playerColor={p.color} />)}
        </div>);
    }

    return <>{body}</>;
}
