import React from "react";
import { HandScore } from "./handScore";
import { Card } from "./card";

export type KeepCard = { [card: number]: boolean };
export const Hand: React.FC<{ cards: number[], maxKeep?: number, cut?: number[], keepCards: KeepCard, setKeepCards?: (newValue: KeepCard) => void }> = props => {

    return <>
        <div key="hand" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {props.cards.map((card, i) => <Card
                card={card}
                index={i}
                key={i}
                throw={!!props.maxKeep && !props.keepCards[card]}
                onClick={props.setKeepCards ? () => {
                    if (props.maxKeep && props.setKeepCards) {
                        let newthrow = { ...props.keepCards };
                        const keys = Object.keys(newthrow).filter(key => !!newthrow[key as any]);
                        if (keys.length >= props.maxKeep && !props.keepCards[card]) {
                            return;
                        }

                        newthrow[card] = !newthrow[card];
                        props.setKeepCards(newthrow);
                    }
                } : undefined} />)}

            {/* Show the score for the currently selected cards only */}
        </div>
        <HandScore key="score" hand={props.cards.filter((card, index) => props.keepCards[index])} cut={props.cut} />
    </>;
}