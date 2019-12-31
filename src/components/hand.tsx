import React from "react";
import { HandScore } from "./handScore";
import { Card } from "./card";
import { parseCard } from "../game/card";

export type KeepCard = { [card: number]: boolean };
interface SelectableHandProps {
    cards: number[],
    maxKeep?: number,
    cut?: number[],
    keepCards?: KeepCard,
    setKeepCards?: (newValue: KeepCard) => void
    showScore?: boolean;
    currentCount?: number;
}

export function ExtractKeptCard(keepCard: KeepCard): number {
    return parseInt(Object.keys(keepCard).filter((card, index) => !!keepCard[card as any])[0]);
}

export const HandAndScore: React.FC<SelectableHandProps> = props => {
    const { maxKeep, setKeepCards, keepCards, cut, showScore, cards } = props;
    const onClick = React.useMemo<((newCard: number) => void) | undefined>(() => keepCards && setKeepCards
        ? card => {
            if (maxKeep && setKeepCards && keepCards) {
                let newthrow = { ...keepCards };
                const keys = Object.keys(newthrow).filter(key => !!newthrow[key as any]);
                if (keys.length >= maxKeep && !keepCards[card]) {
                    return;
                }

                newthrow[card] = !newthrow[card];
                setKeepCards(newthrow);
            }
        }
        : undefined,
        [keepCards, maxKeep, setKeepCards]);

    return <>
        <Hand
            {...props}
            onClick={onClick}
        />
        {keepCards && showScore && <HandScore key="score" hand={cards.filter((card, index) => !!keepCards![card])} cut={cut} />}
    </>;
}

interface HandProps {
    cards: number[],
    maxKeep?: number,
    keepCards?: KeepCard,
    onClick?: (card: number) => void,
    stacked?: boolean,
    currentCount?: number;
}

export const Hand: React.FC<HandProps> = props => {
    const { maxKeep, keepCards, stacked, cards, onClick, currentCount } = props;
    return (
        <div key="hand" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {cards.map((card, i) => {
                let disabled = !!currentCount && parseCard(card).count + currentCount > 31;
                return <Card
                    disabled={disabled}
                    stacked={stacked}
                    card={card}
                    index={i}
                    key={i}
                    selected={keepCards && (!!maxKeep && keepCards[card])}
                    onClick={onClick ? () => onClick!(card) : undefined}
                />
            })}
        </div>);
}