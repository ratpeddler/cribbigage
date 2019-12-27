import React from "react";
import { parseCard } from "../game/card";
import { HandScore } from "./handScore";

export const Hand: React.FC<{ cards: number[], maxKeep?: number, cut?: number[], keepCards: { [card: number]: boolean }, setKeepCards: (newValue: { [card: number]: boolean }) => void }> = props => {

    return <div style={{ display: "flex", flexDirection: "row" }}>
        Hand:
        {props.cards.map((card, i) => <Card card={card} index={i} key={i} throw={!!props.maxKeep && !props.keepCards[i]} onClick={() => {
            if (props.maxKeep) {
                let newthrow = { ...props.keepCards };
                const keys = Object.keys(newthrow).filter(key => !!newthrow[key as any]);
                if (keys.length >= props.maxKeep && !props.keepCards[i]) {
                    return;
                }

                newthrow[i] = !newthrow[i];
                props.setKeepCards(newthrow);
            }
        }} />)}

        {/* Show the score for the currently selected cards only */}
        <HandScore hand={props.cards.filter((card, index) => props.keepCards[index])} cut={props.cut} />
    </div>;
}

export const Card: React.FC<{ card: number, index: number, throw?: boolean, onClick?: () => void }> = props => {
    const { value, suit } = parseCard(props.card);

    return <div style={{
        backgroundColor: props.throw ? "lightgrey" : undefined,
        color: suit == "Diamonds" || suit == "Hearts" ? "red" : "black",
        border: "1px solid black",
        alignItems: "center",
        height: "100px",
        width: "75px",
        margin: "15px",
        padding: "5px",
    }}
        onClick={props.onClick}
    >
        <div>{value}</div>
        <div>{suit}</div>
    </div>;
}