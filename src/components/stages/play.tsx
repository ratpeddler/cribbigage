import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { sumCards, canPlay, cantPlayAtAll, playAI, filterHand, playStageOver, playCard, pass, ensureNextPlayer, getCurrentPlayer, getPlayableHand } from "../../game/play";
import { IsYou } from "./chooseGameMode";

const AutoAdvanceToYourTurn = false;
const SlowAdvanceToYourTurn = true;
const SlowAIDelay = 1200; // 1.2 seconds

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;
    const { players, previousPlayedCards = [], playedCards = [] } = game;

    const user = players.filter(IsYou)[0];

    // need to filter out the already played cards
    const cantPlay = cantPlayAtAll(user, playedCards, previousPlayedCards);

    const isYourTurn = IsYou(players[ensureNextPlayer(game)]);

    // If using WHILE, add this here to auto advance to your next move. Otherwise use buttons to view AI actions
    React.useEffect(() => {
        if (AutoAdvanceToYourTurn) {
            //console.log("checking if user should play", game.nextToPlay)
            let nextToPlay = game.nextToPlay || 0;
            if (!IsYou(players[nextToPlay])) {
                setGameState(playAI(game, true), false);
            }
        }
        else if (SlowAdvanceToYourTurn && !isYourTurn) {
            // Add some time out here
            setTimeout(() => {
                console.log("slowly advancing for " + players[ensureNextPlayer(game)].name);
                setGameState(playAI(game, false), false);
            }, SlowAIDelay);
        }
    }, [game.nextToPlay, isYourTurn]);
    const remainingCards = getPlayableHand(players.filter(IsYou)[0], game);

    return <div style={{ height: "100%", width: "100%", padding: "0 20px", textAlign: "center" }}>
        <h3>Current count: {playedCards && sumCards(playedCards)}</h3>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "center" }}>
            {previousPlayedCards && previousPlayedCards.length > 0 && <div style={{ padding: "0px 10px", borderRight: "1px solid lightgrey", marginRight: 10 }}>
                Previous cards:
                {previousPlayedCards && <Hand cards={previousPlayedCards} keepCards={{}} stacked={true} />}
            </div>}
            {playedCards && playedCards.length > 0 && <div style={{ marginLeft: 15 }}>
                Played cards:
                {playedCards && <Hand cards={playedCards} keepCards={{}} />}
            </div>}
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {remainingCards.length > 0 && <div>
                Your Hand:
                {players.map((p, index) => {
                    return IsYou(p) && <HandAndScore
                        allDisabled={!isYourTurn}
                        cards={remainingCards}
                        key={index}
                        maxKeep={1}
                        currentCount={playedCards ? sumCards(playedCards) : 0}
                        keepCards={keepCard}
                        setKeepCards={newKeptCards => {
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
                    />
                })}
            </div>}
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center", padding: 10 }}>
                {playStageOver(game) ? null : <h3>{isYourTurn ? "It's your turn to play!" : `${players[ensureNextPlayer(game)].name} is playing...`}</h3>}
                {isYourTurn ? null : <Button onClick={() => { }} loading disabled>{players[ensureNextPlayer(game)].name} is playing...</Button>}

                {!isYourTurn && !SlowAdvanceToYourTurn && <Button
                    onClick={() => { setGameState(playAI(game, false), false) }}>
                    AI's turn
                </Button>}

                {!cantPlay && isYourTurn && !playStageOver(game) && <Button
                    disabled={disabled}
                    onClick={() => {
                        let playedCard = ExtractKeptCard(keepCard);

                        // Reset the current selection
                        setKeepCard({});
                        // only have PLAYAI if you want to auto advance!
                        setGameState(AutoAdvanceToYourTurn ? playAI(playCard(game, playedCard)) : playCard(game, playedCard), false);
                    }}>
                    {disabled ? "Select a card to play" : "Play selected card"}
                </Button>}

                {cantPlay && isYourTurn && !playStageOver(game) && <Button disabled={!cantPlay} onClick={() => {
                    // Reset the current selection
                    setKeepCard({});
                    // always advance on pass?
                    setGameState(AutoAdvanceToYourTurn ? playAI(pass(game), true) : pass(game), false);
                }}>
                    Pass
                </Button>}

                {playStageOver(game) && <Button
                    disabled={!playStageOver(game)}
                    onClick={() => {
                        // TODO: This needs to handle LAST CARD
                        // NEEDS TO CHECK IF it ended on 31 too!
                        props.setGameState({
                            ...props.game,
                            previousPlayedCards: [],
                            playedCards: [],
                            nextToPlay: 0,
                            lastToPlay: undefined,
                        }, true)
                    }}>
                    Play is done. Go to score hands
                </Button>}
            </div>

        </div>
    </div>;
}