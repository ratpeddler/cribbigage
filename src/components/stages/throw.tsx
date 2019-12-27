import React from "react";
import { GameComponent } from "../game";
import { HandAndScore } from "../hand";
import { Button } from "../button";

export const Throw: GameComponent = props => {
    const mustKeep = 4; // TODO Get this from game state
    const [keepCards, setKeepCards] = React.useState<{ [card: number]: boolean }>({});
    const disabled = Object.keys(keepCards).filter(key => !!keepCards[key as any]).length != mustKeep;

    // TODO: This should either let you pick all hands or just your own
    return <div>
        Select which cards you will keep in your hand. (You must keep {mustKeep})

        Your hand:
        {props.game.players.map((p, index) => index == 0 && <HandAndScore showScore={true} cards={p.hand} key={index} maxKeep={mustKeep} keepCards={keepCards} setKeepCards={setKeepCards} />)}

        <Button
            disabled={disabled}
            onClick={() => {
                props.setGameState({
                    ...props.game,
                    players: props.game.players.map((p, pi) => ({
                        ...p,
                        hand: p.hand.filter((c, ci) => {
                            if (pi > 0) {
                                // This is a local hack for now:
                                return ci < mustKeep;
                            }

                            return keepCards[c];
                        })
                    })),
                    crib: props.game.players.flatMap((p, pi) => p.hand.filter((c, ci) => {
                        if (pi > 0) {
                            // This is a local hack for now:
                            return ci >= mustKeep;
                        }

                        return !keepCards[c];
                    })),
                }, true);
            }}>
            Keep selected cards
            </Button>
    </div>;
}