import React from "react";
import { Column, Row } from "./layouts/Horizontal_2Player";
import { PlayerState } from "../game/players";

export const PlayLogContext = React.createContext<IPlayLogContext>({ log: [], addPlayLog: () => { } });

export interface IPlayLogContext {
    log: string[];
    addPlayLog: (player: PlayerState, message: string) => void;
}

export const PlayLog: React.FC = props => {
    const context = React.useContext(PlayLogContext);

    return <Column overflow="auto" fill>
        {context.log.map((l, i) => <Row key={i}>{l}</Row>)}
    </Column>
}