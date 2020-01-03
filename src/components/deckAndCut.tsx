import React from "react";
import { Hand } from "./hand";
import { Card, Back, SuperStackedMargin, SuperStackedTopMargin, CardWidth, GameDragEvent } from "./card";
import { GameState } from "../game/game";

type DeckAndCutProps = {
    game?: GameState;
    onDragOver?: GameDragEvent;
    onDrop?: GameDragEvent;
};

export const DeckAndCut: React.FC<DeckAndCutProps> = props => {
    const deck = [-1];
    const cardsInDeck = 10;
    for (let i = 0; i < cardsInDeck; i++) {
        deck.push(-1);
    }

    return <div
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
        style={{
            display: "flex",
            flexDirection: "row",
            flex: "none",
            padding: "0 10px",
            alignItems: "center"
        }}>
        <div style={{ marginLeft: (-.5 * SuperStackedMargin) + 40, paddingTop: -1 * cardsInDeck * SuperStackedTopMargin, minWidth: CardWidth * .5 + 16 }}>
            <Hand cards={[...deck, ...props.game?.cut || []]} superStacked />
        </div>
        <div><Hand cards={(props.game?.crib || []).map(c => -1)} stacked /></div>
    </div>
}
