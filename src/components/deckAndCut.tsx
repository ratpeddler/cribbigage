import React from "react";
import { Hand } from "./hand";
import { Card, Back, SuperStackedMargin, SuperStackedTopMargin, CardWidth } from "./card";
import { GameState } from "../game/game";

export const DeckAndCut: React.FC<{ game?: GameState }> = props => {
    const deck = [-1];
    const cardsInDeck = 15;
    for (let i = 0; i < cardsInDeck; i++) {
        deck.push(-1);
    }

    return <div style={{
        display: "flex",
        flexDirection: "row",
        flex: "none",
        padding: "0 10px",
        //borderRight: "1px solid lightgrey",
        //marginRight: 20,
        alignItems: "center"
    }}>
        <div style={{ marginLeft: (-.5 * SuperStackedMargin) + 40, paddingTop: -1 * cardsInDeck * SuperStackedTopMargin, minWidth: CardWidth * .5 + 16 }}><Hand cards={deck} superStacked /></div>
        <div><Hand cards={props.game?.cut || [-1]} stacked /></div>
    </div>
}
