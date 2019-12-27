import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore } from "../hand";
import { Button } from "../button";
import { scorePlay, sumCards } from "../../game/play";

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    console.log(keepCard);

    return <div>
        Play cards!

        Cut:
        <Hand cards={props.game.cut!} />

        Previous Played cards:
        {props.game.previousPlayedCards && <Hand cards={props.game.previousPlayedCards} keepCards={{}} />}

        Played cards:
        {props.game.playedCards && <Hand cards={props.game.playedCards} keepCards={{}} />}

        Your Hand:
        {props.game.players.map((p, index) => {
            const remainingCards = p.hand.filter(c => props.game.playedCards!.indexOf(c) < 0);
            return index == 0 && <HandAndScore
                cards={remainingCards}
                key={index}
                maxKeep={1}
                keepCards={keepCard}
                setKeepCards={setKeepCard}
            />
        })}

        Current count: {props.game.playedCards && sumCards(props.game.playedCards)}
        SCORE: {props.game.playedCards && Object.keys(keepCard).filter(c => !!keepCard[c as any]).length && scorePlay(props.game.playedCards!, parseInt(Object.keys(keepCard).filter(c => !!keepCard[c as any])[0]))}

        <Button
            disabled={disabled}
            onClick={() => {

                let playedCard = parseInt(Object.keys(keepCard).filter(c => !!keepCard[c as any])[0]);
                let playedCards = [...props.game.playedCards || []];
                playedCards.push(playedCard);

                // TODO: this is only the current player...
                let score = scorePlay(playedCards, playedCard);
                
                // TODO: Play the other player's card
                // Enforce 31
                // Display 31 and previous cards

                // Reset the current selection
                setKeepCard({});

                // Update played cards
                props.setGameState({
                    ...props.game,
                    playedCards
                }, false);

            }}>
            Play selected card
        </Button>

        <Button onClick={() => props.setGameState(props.game, true)}>
            Score hands
        </Button>
    </div>;
}