/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { GameComponent } from "../game";
import { KeepCard, ExtractKeptCard, onDragOverMovableArea } from "../hand";
import { Button } from "../button";
import { sumCards, canPlay, cantPlayAtAll, playStageOver, playCard, pass } from "../../game/play";
import { playAI } from "../../ai/AI_play";
import { IsYou, ensureNextPlayer } from "../../game/players";
import { LocalOrMultiplayer } from "./initAndWait";
import { LoadGameFromServer } from "../../App";
import { playSound } from "../../sounds/playSound";

const AutoAdvanceToYourTurn = false;
const SlowAdvanceToYourTurn = true;
const SlowAIDelay = 1200; // 1.2 seconds
const fastAIDelay = 500; // 1.2 seconds

export const Play: GameComponent = props => {
    const Layout = props.layout;
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;
    const { players, previousPlayedCards = [], playedCards = [] } = game;

    const stageIsOver = playStageOver(game);
    const user = players.filter(IsYou)[0];

    const cantPlay = cantPlayAtAll(user, playedCards, previousPlayedCards);
    const isYourTurn = IsYou(players[ensureNextPlayer(game)]);

    React.useEffect(()=>{
        if(isYourTurn){
            // TODO: Only play this if it has been some time? like say a second without any action?
            playSound("Whistle");
        }
    }, [isYourTurn]);

    const passYourTurn = () => {
        // Reset the current selection
        setKeepCard({});
        // always advance on pass?
        setGameState(AutoAdvanceToYourTurn && LocalOrMultiplayer == "local"
            ? playAI(pass(game), true)
            : pass(game), false);
    }

    const onDrop = React.useCallback((ev: React.DragEvent<HTMLDivElement>) => {
        ev.persist();
        ev.preventDefault();
        ev.stopPropagation();
        const playedCard = parseInt(ev.dataTransfer.getData("text/plain"));

        if (isNaN(playedCard)) {
            throw "played card was NAN";
        }

        if (canPlay(playedCards, playedCard)) {
            // Reset the current selection
            setKeepCard({});
            // only have PLAYAI if you want to auto advance!
            setGameState(AutoAdvanceToYourTurn && LocalOrMultiplayer == "local"
                ? playAI(playCard(game, user, playedCard), false)
                : playCard(game, user, playedCard), false);
        }
    }, [game, setGameState, setKeepCard]);

    // Trigger any AI actions
    React.useEffect(() => {
        if (stageIsOver) {
            // you can stop now. No need to have other say "GO"
            return;
        }

        if(!isYourTurn && LocalOrMultiplayer == "online"){
            // poll for other player's move
            setTimeout(() => {
                LoadGameFromServer().then(g => setGameState(g, false));                
            }, 1500);
        }

        if (LocalOrMultiplayer == "local") {
            // special case for "GO" OR "31"
            if (sumCards(game.playedCards || []) == 31) {
                if (!isYourTurn) {
                    // Add some time out here
                    setTimeout(() => {
                        setGameState(playAI(game, false), false);
                    }, fastAIDelay);
                }
            }

            else if (AutoAdvanceToYourTurn && !isYourTurn) {
                setGameState(playAI(game, true), false);
            }
            else if (SlowAdvanceToYourTurn && !isYourTurn) {
                // Add some time out here
                setTimeout(() => {
                    setGameState(playAI(game, false), false);
                }, SlowAIDelay);
            }
        }
    }, [game.nextToPlay, isYourTurn]);

    return <Layout
        setGameState={props.setGameState}
        onDragOverPlayedCards={onDragOverMovableArea}
        onDropOverPlayedCards={onDrop}
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
        userActions={() => <div
            style={{ textAlign: "center", height: "100%", width: "100%", flex: "auto", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}
            onDragOver={onDragOverMovableArea}
            onDrop={onDrop}
        >
            {!stageIsOver && <h3>Current count: {sumCards(game.playedCards || [])}</h3>}
            {stageIsOver || isYourTurn ? null : <Button onClick={() => { }} loading disabled>{players[ensureNextPlayer(game)].name} is playing...</Button>}

            {!isYourTurn && !SlowAdvanceToYourTurn && LocalOrMultiplayer == "local" && <Button
                onClick={() => { setGameState(playAI(game, false), false) }}>
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
                        setGameState(AutoAdvanceToYourTurn && LocalOrMultiplayer == "local"
                            ? playAI(playCard(game, user, playedCard), false)
                            : playCard(game, user, playedCard), false);
                    }}>
                    {disabled ? "Select a card to play" : "Play selected card"}
                </Button>}

            {cantPlay && isYourTurn && !stageIsOver &&
                <Button disabled={!cantPlay} onClick={passYourTurn}>
                    Pass
                </Button>}

            {stageIsOver && <Button
                disabled={!stageIsOver || (LocalOrMultiplayer == "online" && !isYourTurn)}
                onClick={() => {
                    // This doesn't really need to go to the SERVER. This should be a client only thing.
                    // OR we can limit it so only 1 player can do this. Maybe the new dealer?
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
        </div>
        }
    />;
}