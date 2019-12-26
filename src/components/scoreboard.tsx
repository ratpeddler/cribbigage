import React from "react";

export const ScoreBoard: React.FC<{scores: number[]}> = props => {
    return <div>
        {props.scores.map((score, i) => <Score score={score} player={i} key={i} />)}
    </div>;
}

export const Score: React.FC<{score: number, player: number}> = props => {
    return <div>
        {`Player ${props.player}: ${props.score}`}
    </div>;
}