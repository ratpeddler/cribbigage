
import React from "react";
import { parseCard, parseNumericalValue } from "../game/card";

type CardProps = {
    card: number;
    index: number;
    selected?: boolean;
    onClick?: () => void;
    stacked?: boolean;
    disabled?: boolean;
    onMove?: (thisCard: number, droppedCard: number) => void;
};

export const Card: React.FC<CardProps> = props => {
    const { card, selected, onClick, stacked, disabled,onMove } = props;
    const { value, suit } = parseCard(card);
    const raw = parseNumericalValue(card);

    const margin = 5;
    const width = 120;

    const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    }

    const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.dataTransfer.setData("text/plain", card.toString());
        ev.dataTransfer.dropEffect = "move";
    };

    const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.persist();
        const droppedCard = parseInt(ev.dataTransfer.getData("text/plain"));
        if(droppedCard !== card){
            onMove && onMove(card, droppedCard);
        }
    }

    const dragProps = onMove ? {
        "data-is-focusable": true,
        draggable: true,
        onDragStart,
        onDragOver,
        onDrop,
    } : {};

    return <div
        {...dragProps}
        style={{
            margin,
            marginLeft: stacked ? -125 : margin,
            border: selected ? "5px solid lightblue" : "5px solid transparent",
            borderRadius: 10,
            padding: 10,
            background: disabled ? "lightgrey" : undefined,
            cursor: disabled ? "not-allowed" : (onClick ? "pointer" : undefined),
        }}
        onClick={disabled ? undefined : onClick}
    >
        <img
            alt={`${value} of ${suit}`}
            style={disabled ? { filter: "grayscale(100%)" } : {}}
            src={`https://aiplayersonline.com/CribBIGage/cards/${raw}_of_${suit.toLowerCase()}.svg`}
            width={width} />
    </div>;
}