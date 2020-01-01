import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";

export const ScoreStage: GameComponent = props => {
    const Layout = props.layout;
    return <Layout
        game={props.game}
        userActions={() =>
            <Button onClick={() => {
                props.setGameState({
                    ...props.game,
                    players: props.game.players.map((p, pi) => {
                        const score = scoreHand(p.hand, props.game.cut!);
                        const newScore = p.score + score.score;
                        if (newScore >= 120) { alert(`${p.name} won!`) }
                        return { ...p, score: newScore, lastScore: p.score };
                    })
                }, true);
            }}>
                Next
            </Button>}
    />;
}