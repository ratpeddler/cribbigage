import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { getCurrentDealer } from "../../game/play";

export const ScoreStage: GameComponent = props => {
    const Layout = props.layout;
    let game = { ...props.game };
    let dealer = getCurrentDealer(game);

    React.useEffect(() => {
        setTimeout(() => {
            props.setGameState({
                ...props.game,
                players: props.game.players.map((p) => {
                    const score = scoreHand(p.hand, props.game.cut!);
                    const newScore = p.score + score.score;
                    if (newScore >= 120) { alert(`${p.name} won!`) }
                    return { ...p, score: newScore, lastScore: p.score };
                })
            }, false);
        }, 500);
    }, []);

    return <Layout
        game={props.game}
        userActions={() =>
            <Button onClick={() => {
                props.setGameState(game, true);
            }}>
                Next
            </Button>}
    />;
}