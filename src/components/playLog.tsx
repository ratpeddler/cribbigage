import React from "react";
import { Column, Row } from "./layouts/Horizontal_2Player";
import { PlayerState } from "../game/players";
import { IScore, createScoreMessage } from "./scoreIcon";

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

export const PlayLog: React.FC = props => {
    const context = React.useContext(PlayLogContext);

    return <Column overflow="auto" fill>
        {context.log.map((l, i) => <div key={l.time}>
            {l.playerName + " " + l.message}
            {l.score && ": " + createScoreMessage(l.score)}
        </div>)}
    </Column>
}