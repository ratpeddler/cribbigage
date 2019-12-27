import React from "react";
import { PlayerState } from "../game/turns";

export const ScoreBoard: React.FC<{ players: PlayerState[] }> = props => {
    return <div>
        {props.players.map((p, i) => <Score score={p.score} player={p.name} key={i} hasCrib={i == props.players.length - 1} />)}
    </div>;
}

export const Score: React.FC<{ score: number, player: string, hasCrib?: boolean }> = props => {
    return <div>
        {`${props.player}: ${props.score}`}
        {props.hasCrib ? " (CRIB)" : null}
    </div>;
}