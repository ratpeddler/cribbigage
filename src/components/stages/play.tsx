import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { scorePlay, sumCards, canPlay } from "../../game/play";

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { game, setGameState } = props;
    const { players, previousPlayedCards, playedCards, cut } = game;

    console.log(keepCard);

    return <div>
        Play cards!

        Cut:
        <Hand cards={cut!} />

        Previous Played cards:
        {previousPlayedCards && <Hand cards={previousPlayedCards} keepCards={{}} />}

        Played cards:
        {playedCards && <Hand cards={playedCards} keepCards={{}} />}

        Your Hand:
        {players.map((p, index) => {
            const remainingCards = p.hand.filter(c => playedCards!.indexOf(c) < 0);
            return index == 0 && <HandAndScore
                cards={remainingCards}
                key={index}
                maxKeep={1}
                keepCards={keepCard}
                setKeepCards={newKeptCards => {
                    // ENFORCE play rules
                    if (canPlay(playedCards, ExtractKeptCard(newKeptCards))) {
                        setKeepCard(newKeptCards);
                    }
                    else {
                        console.log("cant play that!");
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
                let newPlayedCards = [...playedCards || []];
                newPlayedCards.push(playedCard);

                // TODO: this is only the current player...
                let score = scorePlay(playedCards || [], playedCard);

                // TODO: Play the other player's card
                // Enforce 31
                // Display 31 and previous cards

                // Reset the current selection
                setKeepCard({});

                // Update played cards
                props.setGameState({
                    ...props.game,
                    playedCards: newPlayedCards
                }, false);

            }}>
            Play selected card
        </Button>

        <Button onClick={() => props.setGameState(props.game, true)}>
            Score hands
        </Button>
    </div>;
}