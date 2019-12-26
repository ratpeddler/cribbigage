import React from "react";
import { parseCard } from "../game/deal";

export const Hand: React.FC<{ cards: number[] }> = props => {
    const canThrow = 2;
    const [willThrow, setwillThrow] = React.useState<{ [card: number]: boolean }>({});

    return <div style={{ display: "flex", flexDirection: "row" }}>
        Hand:
        {props.cards.map((card, i) => <Card card={card} index={i} key={i} willThrow={willThrow[i]} onClick={() => {
            let newthrow = { ...willThrow };
            newthrow[i] = !newthrow[i];
            setwillThrow(newthrow);
        }} />)}
    </div>;
}

export const Card: React.FC<{ card: number, index: number, willThrow?: boolean, onClick?: () => void }> = props => {
    const { value, suit } = parseCard(props.card);


    return <div style={{
        backgroundColor: props.willThrow ? "lightgrey" : undefined,
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