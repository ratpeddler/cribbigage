import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore } from "../hand";

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    console.log(keepCard);

    // TODO: This should only show YOUR hand
    return <div>
        Play cards

        Played cards:
        {props.game.playedCards && <Hand cards={props.game.playedCards} keepCards={{}} />}

        Your Hand:
        {props.game.players.map((p, index) => {
            const remainingCards = p.hand.filter(c => props.game.playedCards!.indexOf(c) < 0);
            return <HandAndScore
                cards={remainingCards}
                key={index}
                maxKeep={1}
                keepCards={keepCard}
                setKeepCards={setKeepCard}
            />
        })}

        <button
            disabled={disabled}
            onClick={() => {
                let playedCard = parseInt(Object.keys(keepCard).filter(c => !!keepCard[c as any])[0]);
                let playedCards = [...props.game.playedCards || []];
                playedCards.push(playedCard);

                // Reset the current selection
                setKeepCard({});

                // Update played cards
                props.setGameState({
                    ...props.game,
                    playedCards
                }, false);

            }}>
            Play selected card
        </button>

        <button onClick={() => props.setGameState(props.game, true)}>
            Score hands
        </button>
    </div>;
}