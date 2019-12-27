import React from "react";
import { GameComponent } from "../game";
import { HandAndScore } from "../hand";

export const Throw: GameComponent = props => {
    const mustKeep = 4; // TODO Get this from game state
    const [keepCards, setKeepCards] = React.useState<{ [card: number]: boolean }>({});
    const disabled = Object.keys(keepCards).filter(key => !!keepCards[key as any]).length != mustKeep;

    // TODO: This should only show YOUR hand
    return <div>
        Throw cards to the crib
        {props.game.players.map((p, index) => index == 0 && <HandAndScore showScore={true} cards={p.hand} key={index} maxKeep={mustKeep} keepCards={keepCards} setKeepCards={setKeepCards} />)}

        <button
            disabled={disabled}
            onClick={() => {
                props.setGameState({
                    ...props.game,
                    players: props.game.players.map(p => ({
                        ...p,
                        hand: p.hand.filter((c) => keepCards[c])
                    })),
                    crib: props.game.players.flatMap(p => p.hand.filter(c => !keepCards[c])),
                }, true);
            }}>
            Keep selected hand
            </button>
    </div>;
}