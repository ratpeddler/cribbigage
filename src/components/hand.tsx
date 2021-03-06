import React from "react";
import { HandScore } from "./handScore";
import { Card, StackedMargin } from "./card";
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
    onReorder?: (newHand: number[]) => void,
    allDisabled?: boolean,
    stacked?: boolean,
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
    superStacked?: boolean,
    currentCount?: number;
    onReorder?: (newHand: number[]) => void,
    allDisabled?: boolean,
}

export const Hand: React.FC<HandProps> = props => {
    const { maxKeep, keepCards, stacked, cards, onClick, currentCount, onReorder, allDisabled, superStacked } = props;

    return (
        <div key="hand" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginLeft: stacked ? -1 * StackedMargin : undefined }}>
            {cards.map((card, i) => {
                // TODO: Need to optimize this!
                const onDragOver = onDragOverMovableArea;

                const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
                    ev.persist();
                    console.log("setting data", card.toString());
                    ev.dataTransfer.setData("text/plain", card.toString());
                    ev.dataTransfer.dropEffect = "move";
                };

                const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
                    ev.persist();
                    ev.preventDefault();
                    ev.stopPropagation();
                    const droppedCard = parseInt(ev.dataTransfer.getData("text/plain"));
                    if (droppedCard !== card) {
                        let newCards = [...cards].filter(c => c !== droppedCard);
                        newCards.splice(newCards.indexOf(card), 0, droppedCard);
                        props.onReorder && props.onReorder(newCards);
                    }
                }

                const dragProps = onReorder ? {
                    onDragStart,
                    onDragOver,
                    onDrop,
                } : undefined;

                let disabled = !!currentCount && parseCard(card).count + currentCount > 31;
                return <Card
                    dragProps={dragProps}
                    disabled={disabled || allDisabled}
                    stacked={stacked}
                    superStacked={superStacked}
                    card={card}
                    index={i}
                    key={i}
                    selected={keepCards && (!!maxKeep && keepCards[card])}
                    onClick={onClick ? () => onClick!(card) : undefined}
                />
            })}
        </div>);
}

export const onDragOverMovableArea = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}