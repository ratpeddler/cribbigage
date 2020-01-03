import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import { PlayLogContext } from "../playLog";
import _ from "lodash";
import { getCurrentDealer } from "../../game/players";

export const ScoreStage: GameComponent = props => {
    const Layout = props.layout;
    const logContext = React.useContext(PlayLogContext);
    let game = _.cloneDeep(props.game);
    let dealer = getCurrentDealer(game);

    const [hasCounted, setHasCounted] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => {
            // this is in correct order
            for (let p of game.players) {
                const score = scoreHand(p.hand, props.game.cut!);
                const newScore = p.score + score.score;
                addPlayerScore(p, score.score, game);

                if (newScore > game.rules.pointsToWin) {
                    // a player has won, stop counting and update the game
                    break;
                }
            }

            props.setGameState(game, false);
            setHasCounted(true);
        }, 500);
    }, []);

    return <Layout
        hideScores
        game={props.game}
        userActions={() =>
            <Button disabled={!hasCounted} onClick={() => {
                props.setGameState(game, true);
            }}>
                {hasCounted ? "Next" : "Scoring hands..."}
            </Button>
        }
    />;
}