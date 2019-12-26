import React from "react";
import { parseCard } from "../game/deal";

export const Hand: React.FC<{ cards: number[], maxKeep?: number }> = props => {
    const [keepCards, setKeepCards] = React.useState<{ [card: number]: boolean }>({});

    return <div style={{ display: "flex", flexDirection: "row" }}>
        Hand:
        {props.cards.map((card, i) => <Card card={card} index={i} key={i} throw={!!props.maxKeep && !keepCards[i]} onClick={() => {
            if (props.maxKeep) {
                let newthrow = { ...keepCards };
                const keys = Object.keys(newthrow).filter(key => !!newthrow[key as any]);
                if (keys.length >= props.maxKeep && !keepCards[i]) {
                    return;
                }

                newthrow[i] = !newthrow[i];
                setKeepCards(newthrow);
            }
        }} />)}
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