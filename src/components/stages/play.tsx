import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { sumCards, canPlay, cantPlayAtAll, playAI, filterHand, playStageOver, playCard, pass, ensureNextPlayer, getCurrentPlayer, getPlayableHand } from "../../game/play";
import { IsYou } from "./chooseGameMode";
import { ScoreContext } from "../scoreIcon";

const AutoAdvanceToYourTurn = false;
const SlowAdvanceToYourTurn = true;
const SlowAIDelay = 1200; // 1.2 seconds

export const Play: GameComponent = props => {
    const Layout = props.layout;
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const scoreContext = React.useContext(ScoreContext);
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;
    const { players, previousPlayedCards = [], playedCards = [] } = game;

    const user = players.filter(IsYou)[0];

    // need to filter out the already played cards
    const cantPlay = cantPlayAtAll(user, playedCards, previousPlayedCards);

    const isYourTurn = IsYou(players[ensureNextPlayer(game)]);

    const passYourTurn = () => {
        // Reset the current selection
        setKeepCard({});
        // always advance on pass?
        setGameState(AutoAdvanceToYourTurn
            ? playAI(pass(game, scoreContext), true, scoreContext)
            : pass(game, scoreContext), false);
    }

    // If using WHILE, add this here to auto advance to your next move. Otherwise use buttons to view AI actions
    React.useEffect(() => {
        // special case for "GO" OR "31"

        if (sumCards(game.playedCards || []) == 31) {
            if (isYourTurn) {
                passYourTurn();
            }
            else {
                // Add some time out here
                setTimeout(() => {
                    console.log("slowly advancing for " + players[ensureNextPlayer(game)].name);
                    setGameState(playAI(game, false, scoreContext), false);
                }, SlowAIDelay);
            }
        }

        else if (AutoAdvanceToYourTurn) {
            if (!isYourTurn) {
                setGameState(playAI(game, true, scoreContext), false);
            }
        }
        else if (SlowAdvanceToYourTurn && !isYourTurn) {
            // Add some time out here
            setTimeout(() => {
                console.log("slowly advancing for " + players[ensureNextPlayer(game)].name);
                setGameState(playAI(game, false, scoreContext), false);
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
            {isYourTurn ? null : <Button onClick={() => { }} loading disabled>{players[ensureNextPlayer(game)].name} is playing...</Button>}

            {!isYourTurn && !SlowAdvanceToYourTurn && <Button
                onClick={() => { setGameState(playAI(game, false), false) }}>
                AI's turn
                </Button>}

            {!cantPlay && isYourTurn && !playStageOver(game) &&
                <Button
                    disabled={disabled}
                    onClick={() => {
                        let playedCard = ExtractKeptCard(keepCard);
                        // Reset the current selection
                        setKeepCard({});
                        // only have PLAYAI if you want to auto advance!
                        setGameState(AutoAdvanceToYourTurn
                            ? playAI(playCard(game, playedCard, scoreContext), false, scoreContext)
                            : playCard(game, playedCard, scoreContext), false);
                    }}>
                    {disabled ? "Select a card to play" : "Play selected card"}
                </Button>}

            {cantPlay && isYourTurn && !playStageOver(game) &&
                <Button disabled={!cantPlay} onClick={passYourTurn}>
                    Pass
                </Button>}

            {playStageOver(game) && <Button
                disabled={!playStageOver(game)}
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