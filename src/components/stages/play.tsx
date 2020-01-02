import React from "react";
import { GameComponent } from "../game";
import { KeepCard, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { sumCards, canPlay, cantPlayAtAll, playStageOver, playCard, pass, ensureNextPlayer } from "../../game/play";
import { IsYou } from "./chooseGameMode";
import { PlayLogContext } from "../playLog";
import { playAI } from "../../ai/AI_play";

const AutoAdvanceToYourTurn = false;
const SlowAdvanceToYourTurn = true;
const SlowAIDelay = 1200; // 1.2 seconds
const fastAIDelay = 500; // 1.2 seconds

const AutoAdvancePlayerDuring31 = false;

export const Play: GameComponent = props => {
    const Layout = props.layout;
    const logContext = React.useContext(PlayLogContext);
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;
    const { players, previousPlayedCards = [], playedCards = [] } = game;

    const stageIsOver = playStageOver(game);
    const user = players.filter(IsYou)[0];

    const cantPlay = cantPlayAtAll(user, playedCards, previousPlayedCards);
    const isYourTurn = IsYou(players[ensureNextPlayer(game)]);

    const passYourTurn = () => {
        // Reset the current selection
        setKeepCard({});
        // always advance on pass?
        setGameState(AutoAdvanceToYourTurn
            ? playAI(pass(game, logContext), true, logContext)
            : pass(game, logContext), false);
    }

    React.useEffect(()=> logContext.addLog(players[0], "starts"), []);

    // If using WHILE, add this here to auto advance to your next move. Otherwise use buttons to view AI actions
    React.useEffect(() => {
        if(stageIsOver){
            // you can stop now. No need to have other say "GO"
            return;
        }

        // special case for "GO" OR "31"
        if (sumCards(game.playedCards || []) == 31) {
            if (isYourTurn) {
                //setTimeout(() => {
                //    passYourTurn();
                //}, SlowAIDelay);
            }
            else {
                // Add some time out here
                setTimeout(() => {
                    setGameState(playAI(game, false, logContext), false);
                }, fastAIDelay);
            }
        }

        else if (AutoAdvanceToYourTurn && !isYourTurn) {
            setGameState(playAI(game, true, logContext), false);
        }
        else if (SlowAdvanceToYourTurn && !isYourTurn) {
            // Add some time out here
            setTimeout(() => {
                setGameState(playAI(game, false, logContext), false);
            }, SlowAIDelay);
        }
    }, [game.nextToPlay, isYourTurn]);

    return <Layout
        game={props.game}
        selectedCards={keepCard}
        setSelectedCards={newKeptCards => {
            let card = ExtractKeptCard(newKeptCards);
            if (card) {
                // ENFORCE play rules
                if (canPlay(playedCards, ExtractKeptCard(newKeptCards))) {
                    setKeepCard(newKeptCards);
                }
                else {
                    alert("cant play that!");
                }
            }
            else {
                setKeepCard(newKeptCards);
            }
        }}
        maxSelectedCards={1}
        userActions={() => <>
            {!stageIsOver && <h3>Current count: {sumCards(game.playedCards || [])}</h3>}
            {isYourTurn ? null : <Button onClick={() => { }} loading disabled>{players[ensureNextPlayer(game)].name} is playing...</Button>}

            {!isYourTurn && !SlowAdvanceToYourTurn && <Button
                onClick={() => { setGameState(playAI(game, false, logContext), false) }}>
                AI's turn
                </Button>}

            {!cantPlay && isYourTurn && !stageIsOver &&
                <Button
                    disabled={disabled}
                    onClick={() => {
                        let playedCard = ExtractKeptCard(keepCard);
                        // Reset the current selection
                        setKeepCard({});
                        // only have PLAYAI if you want to auto advance!
                        setGameState(AutoAdvanceToYourTurn
                            ? playAI(playCard(game, playedCard, logContext), false, logContext)
                            : playCard(game, playedCard, logContext), false);
                    }}>
                    {disabled ? "Select a card to play" : "Play selected card"}
                </Button>}

            {cantPlay && isYourTurn && !stageIsOver &&
                <Button disabled={!cantPlay} onClick={passYourTurn}>
                    Pass
                </Button>}

            {stageIsOver && <Button
                disabled={!stageIsOver}
                onClick={() => {
                    props.setGameState({
                        ...props.game,
                        previousPlayedCards: [],
                        playedCards: [],
                        nextToPlay: 0,
                        lastToPlay: undefined,
                        players: game.players.map(player => {
                            player.playedCards = [];
                            return player;
                        })
                    }, true)
                }}>
                Play is done. Go to score hands
                </Button>}
        </>
        }
    />;
}