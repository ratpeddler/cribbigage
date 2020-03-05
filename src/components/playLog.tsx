import React from "react";
import { Column, Row } from "./layouts/Horizontal_2Player";
import { PlayerState } from "../game/players";
import { IScore, createScoreMessage } from "./scoreIcon";
import { GameState } from "../game/game";
import _ from "lodash";

export const PlayLogContext = React.createContext<IPlayLogContext>({ log: [], addLog: () => { } });

export interface ILog {
    playerName: string,
    time: number,
    message: string,
    score?: IScore,
}

export interface IPlayLogContext {
    log: ILog[];
    addLog: (player: PlayerState | null, message: string, score?: IScore) => void;
}

export const PlayLog: React.FC<{game?: GameState}> = props => {
    const context = React.useContext(PlayLogContext);
    let logs = props.game?.playLog || context.log;

    const [oldLogs, setOldLogs] = React.useState<ILog[]>([]);

    React.useEffect(()=>{
        // TODO: check if we have "new logs" and play any sounds for them
    }, [oldLogs, logs]);

    return <Column overflow="auto" fill>
        {logs.map((l, i) => <div key={l.time}>
            {l.playerName + " " + l.message}
            {l.score && ": " + createScoreMessage(l.score)}
        </div>)}
    </Column>
}

function playSoundForLog(log: ILog){

}