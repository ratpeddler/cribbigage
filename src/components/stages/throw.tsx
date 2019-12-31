import React from "react";
import { GameComponent } from "../game";
import { HandAndScore } from "../hand";
import { Button } from "../button";
import { IsYou } from "./chooseGameMode";
import { getCurrentDealer } from "../../game/play";
import { scoreHand } from "../../game/score";

export const Throw: GameComponent = props => {
    const Layout = props.layout;
    const { game, setGameState } = props;
    const { rules, players } = game;
    const { keepSize } = rules;
    const [keepCards, setKeepCards] = React.useState<{ [card: number]: boolean }>({});

    const user = players.filter(IsYou)[0];
    const dealer = getCurrentDealer(game);
    const yourCrib = IsYou(dealer);

    // TODO Only select the cards you will DISCARD not the ones you will keep
    const mustDiscard = user.hand.length - keepSize;

    const selectedLength =Object.keys(keepCards).filter(key => !!keepCards[key as any]).length;
    const disabled = selectedLength !== keepSize;

    const score = scoreHand(user.hand.filter(c => keepCards[c]), []);

    // TODO: This should either let you pick all hands or just your own
    return <Layout
        game={props.game}
        selectedCards={keepCards}
        setSelectedCards={setKeepCards}
        maxSelectedCards={keepSize}
        onReorderHand={newHand => {
            user.hand = newHand;
            setGameState({ ...game }, false);
        }}
        userActions={() => <>
            <h3 style={{textAlign: "center"}}>
                Select which cards you will keep and which you will discard to {yourCrib ? "your" : dealer.name + "'s"} crib.
            <div>(<span style={{ color: user.color }}>You</span> must keep {keepSize} cards)</div>
            </h3>
            <Button
                disabled={disabled}
                onClick={() => {
                    setGameState({
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
                        crib: [...game.crib || [], ...game.players.flatMap((p, pi) => p.hand.filter((c, ci) => {
                            if (!IsYou(p)) {
                                // This is a local hack for now:
                                return ci >= keepSize;
                            }

                            return !keepCards[c];
                        }))],
                    }, true);
                }}>
                {disabled ? `Select ${keepSize - selectedLength} more cards` : `Keep selected cards (${score.score} pts)`}
            </Button>
        </>} />;
}