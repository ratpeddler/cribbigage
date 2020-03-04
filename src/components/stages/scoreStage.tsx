import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { scoreHand, addPlayerScore } from "../../game/score";
import _ from "lodash";
import { IsYou, getCurrentPlayer } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";
import { incrementNextPlayer } from "../../game/play";

export const ScoreStage: GameComponent = props => {
    const Layout = props.layout;
    let game = _.cloneDeep(props.game);
    const currentPlayer = getCurrentPlayer(game);
    const isYourTurn = IsYou(currentPlayer);

    // TODO: make users click a button to score their hands!
    React.useEffect(() => {
        if (LocalOrMultiplayer == "local") {
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
            }, 500);
        }
    }, []);

    return <Layout
        setGameState={props.setGameState}
        hideScores
        game={props.game}
        userActions={() =>
            <Button disabled={!isYourTurn && LocalOrMultiplayer == "online"} onClick={() => {
                if (LocalOrMultiplayer == "online") {
                    if (!isYourTurn) { throw "can't score when it isn't your turn!"; }
                    const score = scoreHand(currentPlayer.hand, props.game.cut!);
                    addPlayerScore(currentPlayer, score.score, game);
                    game.nextToPlay = incrementNextPlayer(game);

                    // 0 indicates we have gone around the table fully, so we should advance
                    props.setGameState(game, game.nextToPlay == 0);
                }
                else {
                    props.setGameState(game, true);
                }
            }}>
                Score your hand
            </Button>
        }
    />;
}