import React from "react";
import { GameComponent } from "../game";
import { onDragOverMovableArea } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";
import { throwAI } from "../../ai/AI_throw";
import _ from "lodash";
import { GameDragEvent } from "../card";
import { IsYou, getCurrentDealer } from "../../game/players";

export const Throw: GameComponent = props => {
    const Layout = props.layout;
    const { game, setGameState } = props;
    const { rules, players } = game;
    const { keepSize } = rules;
    const [keepCards, setKeepCards] = React.useState<{ [card: number]: boolean }>({});

    const user = players.filter(IsYou)[0];
    const dealer = getCurrentDealer(game);
    const yourCrib = IsYou(dealer);


    const selectedLength = Object.keys(keepCards).filter(key => !!keepCards[key as any]).length;
    const disabled = selectedLength !== keepSize;

    const score = scoreHand(user.hand.filter(c => keepCards[c]), []);

    const onDragOver = onDragOverMovableArea;
    const onDrop = React.useCallback<GameDragEvent>(ev => {
        ev.persist();
        ev.preventDefault();
        ev.stopPropagation();
        const droppedCard = parseInt(ev.dataTransfer.getData("text/plain"));
        console.log("dropped!")
        setKeepCards({...keepCards, [droppedCard]: true});
    }, []);

    // TODO: This should either let you pick all hands or just your own
    return <Layout
        game={game}
        selectedCards={keepCards}
        setSelectedCards={setKeepCards}
        maxSelectedCards={keepSize}
        onDragOverDeck={onDragOver}
        onDropOverDeck={onDrop}
        onReorderHand={newHand => {
            user.hand = newHand;
            setGameState({ ...game }, false);
        }}
        userActions={() => <div
        style={{textAlign: "center"}}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <h3 style={{ textAlign: "center" }}>
                Select which cards you will keep and which you will discard to <span style={{ color: dealer.color }}>{yourCrib ? "your" : dealer.name + "'s"} crib</span>.
            <div>(<span style={{ color: user.color }}>You</span> must keep {keepSize} cards)</div>
            </h3>
            <Button
                disabled={disabled}
                onClick={() => {
                    // get hands and discards for each player
                    let players = _.cloneDeep(game.players);
                    let crib = [...game.crib || []];

                    for (let player of players) {
                        if (IsYou(player)) {
                            crib.push(...player.hand.filter(c => !keepCards[c]));
                            player.hand = player.hand.filter(c => keepCards[c]);
                        }
                        else {
                            const { keep, discard } = throwAI(player, game);
                            crib.push(...discard);
                            player.hand = keep;
                        }
                    }

                    setGameState({
                        ...game,
                        players,
                        crib,
                    }, true);
                }}>
                {disabled ? `Select ${keepSize - selectedLength} more cards` : `Keep selected cards (${score.score} pts)`}
            </Button>
        </div>} />;
}