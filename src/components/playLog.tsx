import React from "react";
import { Column, Row } from "./layouts/Horizontal_2Player";
import { PlayerState } from "../game/players";
import { IScore, createScoreMessage } from "./scoreIcon";
import { GameState } from "../game/game";
import _ from "lodash";

export interface ILog {
    playerName: string,
    time: number,
    message: string,
    score?: IScore,
}

export const PlayLog: React.FC<{game?: GameState}> = props => {
    let logs = props.game?.playLog || [];

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