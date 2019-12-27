import React from "react";
import { HandScore } from "./handScore";
import { Card } from "./card";

export const Hand: React.FC<{ cards: number[], maxKeep?: number, cut?: number[], keepCards: { [card: number]: boolean }, setKeepCards: (newValue: { [card: number]: boolean }) => void }> = props => {

    return <>
        <div key="hand" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
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
        </div>
        <HandScore key="score" hand={props.cards.filter((card, index) => props.keepCards[index])} cut={props.cut} />
    </>;
}