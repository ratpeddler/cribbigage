import React from "react";
import { Column } from "./layouts/Horizontal_2Player";
import { IScore, createScoreMessage } from "./scoreIcon";
import { GameState } from "../game/game";
import _ from "lodash";
import { Sound, playSound } from "../sounds/playSound";

export interface ILog {
    sound?: Sound,
    playerName: string,
    time: number,
    message: string,
    score?: IScore,
}

var oldLogs: ILog[] = [];

export const ResetLogs = () => {
    oldLogs = [];
}

export const PlayLog: React.FC<{ game: GameState }> = props => {
    let logs = props.game.playLog || [];

    React.useEffect(() => {
        // Check if we have "new logs" and play any sounds for them
        if (logs.length > oldLogs.length) {
            console.log("logs were different");
            // do any sounds for new logs and then update old logs
            for (let i = oldLogs.length; i < logs.length; i++) {
                console.log("playing sound", logs[i].sound);
                playSound(logs[i].sound, logs[i].score?.score);
            }

            oldLogs = logs;
        }
        else {
            console.log("play logs were the same, not playing any sounds");
        }
    }, [logs]);

    return <Column overflow="auto" fill>
        {logs.map((l) => <div key={l.time}>
            {l.playerName + " " + l.message}
            {l.score && ": " + createScoreMessage(l.score)}
        </div>)}
    </Column>
}
