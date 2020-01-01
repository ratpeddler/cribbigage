import React from "react";
import { Column, Row } from "./layouts/Horizontal_2Player";

export const PlayLogContext = React.createContext<string[]>([]);

export const PlayLog: React.FC = props => {
    const logContext = React.useContext(PlayLogContext);

    return <Column overflow="auto" fill>
        {logContext.map(l => <Row>{l}</Row>)}
    </Column>
}