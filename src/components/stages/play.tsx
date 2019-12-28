import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { scorePlay, sumCards, canPlay, cantPlayAtAll } from "../../game/play";
import { IsYou } from "./chooseGameMode";

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { game, setGameState } = props;
    const { players, previousPlayedCards = [], playedCards = [], cut } = game;

    console.log(keepCard);

    const cantPlay = cantPlayAtAll(playedCards, players[0].hand);

    return <div>
        Play cards!

        Cut:
        <Hand cards={cut!} />

        Previous Played cards:
        {previousPlayedCards && <Hand cards={previousPlayedCards} keepCards={{}} stacked={true} />}

        Played cards:
        {playedCards && <Hand cards={playedCards} keepCards={{}} />}

        Your Hand:
        {players.map((p, index) => {
            const remainingCards = p.hand.filter(c => playedCards.indexOf(c) < 0).filter(c => previousPlayedCards.indexOf(c) < 0);
            return IsYou(p) && <HandAndScore
                cards={remainingCards}
                key={index}
                maxKeep={1}
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

        Current count: {playedCards && sumCards(playedCards)}
        SCORE: {playedCards && Object.keys(keepCard).filter(c => !!keepCard[c as any]).length && scorePlay(playedCards!, ExtractKeptCard(keepCard))}

        <Button
            disabled={disabled}
            onClick={() => {

                let playedCard = ExtractKeptCard(keepCard);
                let newPlayedCards = [...playedCards];
                newPlayedCards.push(playedCard);

                // TODO: Add score to the players
                let score = scorePlay(playedCards, playedCard);

                // TODO: Play the other player's card
                // Enforce 31 (done)
                // Reset on GO
                // Allow pass only when unable to play
                // Display 31 and previous cards

                // Reset the current selection
                setKeepCard({});

                // Update played cards
                setGameState({
                    ...game,
                    playedCards: newPlayedCards
                }, false);

            }}>
            Play selected card
        </Button>

        <Button disabled={!cantPlay} onClick={() => {
            // TODO have the other person play if they can

            // Reset the current selection
            setKeepCard({});

            // Add the new played cards to the previously played stack
            let newPrevious = [...previousPlayedCards, ...playedCards];

            // Update played cards
            setGameState({
                ...game,
                previousPlayedCards: newPrevious,
                playedCards: []
            }, false);
        }}>
            Pass
        </Button>

        <Button onClick={() => props.setGameState(props.game, true)}>
            SKIP to Score hands
        </Button>
    </div>;
}