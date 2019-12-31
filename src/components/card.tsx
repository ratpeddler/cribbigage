
import React from "react";
import { parseCard, parseNumericalValue, Value, Suit } from "../game/card";
import old from "./../cards/bike_old.jpg";
import red from "./../cards/bike_red.jpg";
import dragon from "./../cards/bike_dragon.jpg";
import clam from "./../cards/clam.jpg";

type CardProps = {
    back?: Back;
    card: number;
    index: number;
    selected?: boolean;
    onClick?: () => void;
    stacked?: boolean;
    superStacked?: boolean;
    disabled?: boolean;
    onMove?: (thisCard: number, droppedCard: number) => void;
};

const padding = 5;
export const CardMargin = 2;
export const CardWidth = 100;
export const StackedMargin = -1 * CardWidth - CardMargin;
export const SuperStackedMargin = -1 * (CardWidth + (2 * CardMargin) + (2 * padding) + 4);
export const SuperStackedTopMargin = -1;

export const Card: React.FC<CardProps> = props => {
    const { card, selected, onClick, stacked, disabled, onMove, superStacked, index } = props;

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
        ev.preventDefault();
        ev.stopPropagation();
        const droppedCard = parseInt(ev.dataTransfer.getData("text/plain"));
        if (droppedCard !== card) {
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
            maxHeight: CardWidth * 1.45,
            margin: CardMargin,
            marginTop: superStacked ? index * SuperStackedTopMargin : CardMargin,
            marginLeft: stacked ? StackedMargin : (superStacked ? SuperStackedMargin : CardMargin),
            border: selected ? "5px solid lightblue" : "5px solid transparent",
            borderRadius: 10,
            padding,
            background: disabled ? "lightgrey" : undefined,
            cursor: disabled ? "not-allowed" : (onClick ? "pointer" : undefined),
        }}
        onClick={disabled ? undefined : onClick}
    >
        {card === -1
            ? <CardBack back={props.back} width={CardWidth} />
            : <CardFace card={card} width={CardWidth} disabled={disabled} />}
    </div>;
}

const CardFace: React.FC<{ card: number, width: number, disabled?: boolean }> = props => {
    const { card, width, disabled } = props;
    const { value, suit } = parseCard(card);
    const raw = parseNumericalValue(card);
    return <img
        alt={`${value} of ${suit}`}
        style={disabled ? { filter: "grayscale(100%)" } : {}}
        src={`https://aiplayersonline.com/CribBIGage/cards/${raw}_of_${suit.toLowerCase()}.svg`}
        width={width}
    />;
}

export type Back = "old" | "dragon" | "red" | "clam";
const CardBack: React.FC<{ back?: Back, width: number }> = props => {
    const { back = "red", width } = props;
    let backCard = red;
    switch (back) {
        case "clam":
            backCard = clam;
            break;
        case "old":
            backCard = old;
            break;
        case "dragon":
            backCard = dragon;
            break;
    }
    return <img
        alt="Back of a card"
        src={backCard}
        width={width}
    />;
}