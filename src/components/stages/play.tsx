import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { scorePlay, sumCards, canPlay, cantPlayAtAll, playAI, filterHand, playStageOver, playCard, pass } from "../../game/play";
import { IsYou } from "./chooseGameMode";

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;
    const { players, previousPlayedCards = [], playedCards = [], cut } = game;

    const user = players.filter(IsYou)[0];

    // need to filter out the already played cards
    const cantPlay = cantPlayAtAll(user, playedCards, previousPlayedCards);

    React.useEffect(() => {
        console.log("checking if user should play", game.nextToPlay)
        let nextToPlay = game.nextToPlay || 0;
        if (!IsYou(players[nextToPlay])) {
            console.log("user was NOT next, so having ai play");
            setGameState(playAI(game), false);
        }
        else {
            console.log("yep it was the users turn");
        }
    }, [game, game.nextToPlay, players, setGameState]);

    return <div style={{ height: "100%", width: "100%" }}>
        Play cards!

        <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
                Cut:
                <Hand cards={cut!} />
            </div>
            <div>
                Previous Played cards:
                {previousPlayedCards && <Hand cards={previousPlayedCards} keepCards={{}} stacked={true} />}
            </div>
            <div>
                Played cards:
                {playedCards && <Hand cards={playedCards} keepCards={{}} />}
            </div>
        </div>
        <h3>Current count: {playedCards && sumCards(playedCards)}</h3>

        Your Hand:
        {players.map((p, index) => {
            const remainingCards = filterHand(p.hand, game.playedCards, game.previousPlayedCards);
            return IsYou(p) && <HandAndScore
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


        SCORE: {playedCards && Object.keys(keepCard).filter(c => !!keepCard[c as any]).length && scorePlay(playedCards!, ExtractKeptCard(keepCard))}

        <Button
            disabled={disabled}
            onClick={() => {
                let playedCard = ExtractKeptCard(keepCard);

                // Reset the current selection
                setKeepCard({});
                setGameState(playAI(playCard(game, playedCard)), false);
            }}>
            Play selected card
        </Button>

        {!playStageOver(game) && <Button disabled={!cantPlay} onClick={() => {
            // Reset the current selection
            setKeepCard({});
            setGameState(playAI(pass(game)), false);
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

        {!playStageOver(game) && <Button onClick={() => props.setGameState({
            ...props.game,
            previousPlayedCards: [],
            playedCards: [],
            nextToPlay: 0,
            lastToPlay: undefined,
        }, true)}>
            SKIP to Score hands
        </Button>}
    </div>;
}