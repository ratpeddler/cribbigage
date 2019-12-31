import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { scorePlay, sumCards, canPlay, cantPlayAtAll, playAI, filterHand, playStageOver, playCard, pass, ensureNextPlayer } from "../../game/play";
import { IsYou } from "./chooseGameMode";

const AutoAdvanceToYourTurn = false;
const SlowAdvanceToYourTurn = true;
const SlowAIDelay = 1200; // 1.2 seconds

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;
    const { players, previousPlayedCards = [], playedCards = [], cut } = game;

    const user = players.filter(IsYou)[0];

    // need to filter out the already played cards
    const cantPlay = cantPlayAtAll(user, playedCards, previousPlayedCards);

    const isYourTurn = IsYou(players[ensureNextPlayer(game)]);

    // If using WHILE, add this here to auto advance to your next move. Otherwise use buttons to view AI actions
    React.useEffect(() => {
        if (AutoAdvanceToYourTurn) {
            console.log("checking if user should play", game.nextToPlay)
            let nextToPlay = game.nextToPlay || 0;
            if (!IsYou(players[nextToPlay])) {
                console.log("user was NOT next, so having ai play");
                setGameState(playAI(game, true), false);
            }
        }
        else if (SlowAdvanceToYourTurn && !isYourTurn) {
            // Add some time out here
            setTimeout(() => {
                setGameState(playAI(game, false), false);
            }, SlowAIDelay);
        }
    }, [game, game.nextToPlay, isYourTurn, players, setGameState]);

    return <div style={{ height: "100%", width: "100%" }}>
        <h3>{isYourTurn ? "It's your turn to play!" : `${players[ensureNextPlayer(game)].name} is playing...`}</h3>

        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ padding: "0px 10px", borderRight: "1px solid lightgrey", marginRight: 10 }}>
                Cut:
                <Hand cards={cut!} />
            </div>
            {previousPlayedCards && previousPlayedCards.length > 0 && <div style={{ padding: "0px 10px", borderRight: "1px solid lightgrey", marginRight: 10 }}>
                Previous cards:
                {previousPlayedCards && <Hand cards={previousPlayedCards} keepCards={{}} stacked={true} />}
            </div>}
            <div style={{ marginLeft: 15 }}>
                Played cards:
                {playedCards && <Hand cards={playedCards} keepCards={{}} />}
            </div>
        </div>
        <h3>Current count: {playedCards && sumCards(playedCards)}</h3>

        Your Hand:
        {players.map((p, index) => {
            const remainingCards = filterHand(p.hand, game.playedCards, game.previousPlayedCards);
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
                            console.log("cant play that!");
                        }
                    }
                    else {
                        setKeepCard(newKeptCards);
                    }
                }}
            />
        })}

        {isYourTurn && !playStageOver(game) && <div>
            SCORE: {playedCards && Object.keys(keepCard).filter(c => !!keepCard[c as any]).length && scorePlay(playedCards!, ExtractKeptCard(keepCard))}
        </div>}

        {isYourTurn ? null : <Button onClick={() => { }} loading disabled>{players[ensureNextPlayer(game)].name} is playing...</Button>}

        {!isYourTurn && !SlowAdvanceToYourTurn && <Button
            onClick={() => { setGameState(playAI(game, false), false) }}>
            AI's turn
        </Button>}

        {isYourTurn && !playStageOver(game) && <Button
            disabled={disabled}
            onClick={() => {
                let playedCard = ExtractKeptCard(keepCard);

                // Reset the current selection
                setKeepCard({});
                // only have PLAYAI if you want to auto advance!
                setGameState(AutoAdvanceToYourTurn ? playAI(playCard(game, playedCard)) : playCard(game, playedCard), false);
            }}>
            Play selected card
        </Button>}

        {isYourTurn && !playStageOver(game) && <Button disabled={!cantPlay} onClick={() => {
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

        {/*!playStageOver(game) && <Button onClick={() => props.setGameState({
            ...props.game,
            previousPlayedCards: [],
            playedCards: [],
            nextToPlay: 0,
            lastToPlay: undefined,
        }, true)}>
            SKIP to Score hands
    </Button>*/}
    </div>;
}