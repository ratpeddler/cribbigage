import React from "react";
import { Hand } from "./hand";
import { Card, Back, SuperStackedMargin, SuperStackedTopMargin } from "./card";
import { GameState } from "../game/game";

export const DeckAndCut: React.FC<{ game?: GameState }> = props => {
    const deck = [-1];
    const cardsInDeck = 20;
    for (let i = 0; i < cardsInDeck; i++) {
        deck.push(-1);
    }

    return <div style={{
        display: "flex",
        flexDirection: "row",
        flex: "none",
        padding: "0px 10px",
        borderRight: "1px solid lightgrey",
        marginRight: 20,
        alignItems: "center"
    }}>
        <div style={{ marginLeft: -1 * SuperStackedMargin, paddingTop: -1 * cardsInDeck * SuperStackedTopMargin }}><Hand cards={deck} superStacked /></div>
        <div><Hand cards={props.game?.cut || [-1]} stacked /></div>
    </div>
}
