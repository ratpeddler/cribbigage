import React from "react";
import { GameComponent } from "../game";
import { HandAndScore } from "../hand";
import { Button } from "../button";
import { IsYou } from "./chooseGameMode";

export const Throw: GameComponent = props => {
    const { game } = props;
    const { rules } = game;
    const { keepSize } = rules;
    const [keepCards, setKeepCards] = React.useState<{ [card: number]: boolean }>({});
    const disabled = Object.keys(keepCards).filter(key => !!keepCards[key as any]).length != keepSize;

    // TODO: This should either let you pick all hands or just your own
    return <div style={{ height: "100%", width: "100%" }}>
        Select which cards you will keep in your hand. (You must keep {keepSize})

        Your hand:
        {props.game.players.map((p, index) => IsYou(p) && <HandAndScore showScore={true} cards={p.hand} key={index} maxKeep={keepSize} keepCards={keepCards} setKeepCards={setKeepCards} />)}

        {game.players[game.players.length - 1].name} has the crib!

        <br />

        <Button
            disabled={disabled}
            onClick={() => {
                props.setGameState({
                    ...props.game,
                    players: props.game.players.map((p, pi) => ({
                        ...p,
                        hand: p.hand.filter((c, ci) => {
                            if (!IsYou(p)) {
                                return ci < keepSize;
                            }

                            return keepCards[c];
                        })
                    })),
                    crib: props.game.players.flatMap((p, pi) => p.hand.filter((c, ci) => {
                        if (!IsYou(p)) {
                            // This is a local hack for now:
                            return ci >= keepSize;
                        }

                        return !keepCards[c];
                    })),
                }, true);
            }}>
            Keep selected cards
            </Button>
    </div>;
}