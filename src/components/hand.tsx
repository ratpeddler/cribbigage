import React from "react";
import { HandScore } from "./handScore";
import { Card } from "./card";

export type KeepCard = { [card: number]: boolean };
interface SelectableHandProps {
    cards: number[],
    maxKeep?: number,
    cut?: number[],
    keepCards?: KeepCard,
    setKeepCards?: (newValue: KeepCard) => void
    showScore?: boolean;
}

export function ExtractKeptCard(keepCard: KeepCard): number {
    return parseInt(Object.keys(keepCard).filter((card, index) => !!keepCard[card as any])[0]);
}

export const HandAndScore: React.FC<SelectableHandProps> = props => {
    const onClick = React.useMemo<((newCard: number) => void) | undefined>(() => props.keepCards && props.setKeepCards
        ? card => {
            if (props.maxKeep && props.setKeepCards && props.keepCards) {
                let newthrow = { ...props.keepCards };
                const keys = Object.keys(newthrow).filter(key => !!newthrow[key as any]);
                if (keys.length >= props.maxKeep && !props.keepCards[card]) {
                    return;
                }

                newthrow[card] = !newthrow[card];
                props.setKeepCards(newthrow);
            }
        }
        : undefined,
        [props.keepCards, props.setKeepCards]);

    return <>
        <Hand
            {...props}
            onClick={onClick}
        />
        {props.keepCards && props.showScore && <HandScore key="score" hand={props.cards.filter((card, index) => !!props.keepCards![card])} cut={props.cut} />}
    </>;
}

interface HandProps {
    cards: number[],
    maxKeep?: number,
    keepCards?: KeepCard,
    onClick?: (card: number) => void,
    stacked?: boolean,
}

export const Hand: React.FC<HandProps> = props => {
    return (
        <div key="hand" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {props.cards.map((card, i) => <Card
                stacked={props.stacked}
                card={card}
                index={i}
                key={i}
                selected={props.keepCards && (!!props.maxKeep && props.keepCards[card])}
                onClick={props.onClick ? () => props.onClick!(card) : undefined}
            />)}
        </div>);
}