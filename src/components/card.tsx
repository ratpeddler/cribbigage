
import React from "react";
import { parseCard, parseRank } from "../game/card";
import old from "./../cards/bike_old.jpg";
import red from "./../cards/bike_red.jpg";
import dragon from "./../cards/bike_dragon.jpg";
import clam from "./../cards/clam.jpg";

export type GameDragEvent = (ev: React.DragEvent<HTMLDivElement>) => void;

type CardProps = {
    back?: Back;
    card: number;
    index: number;
    selected?: boolean;
    onClick?: () => void;
    stacked?: boolean;
    superStacked?: boolean;
    disabled?: boolean;
    dragProps?: {
        onDragOver?: GameDragEvent,
        onDragStart?: GameDragEvent,
        onDrop?: GameDragEvent
    }
};

const padding = 5;
export const CardMargin = 2;
export const CardWidth = 100;
export const StackedMargin = -1 * CardWidth - CardMargin;
export const SuperStackedMargin = -1 * (CardWidth + (2 * CardMargin) + (2 * padding) + 4);
export const SuperStackedTopMargin = -1;

export const Card: React.FC<CardProps> = props => {
    const { card, selected, onClick, stacked, disabled, dragProps, superStacked, index } = props;

    const onDragStart = React.useCallback<GameDragEvent>(ev => {
        ev.persist();
        console.log("setting data", card.toString());
        ev.dataTransfer.setData("text/plain", card.toString());
        ev.dataTransfer.dropEffect = "move";
    }, [card]);

    return <div
        draggable
        onDragStart={onDragStart}
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
    const raw = parseRank(card);
    return <img
        alt={`${value} of ${suit}`}
        style={disabled ? { filter: "grayscale(100%)" } : {}}
        src={`https://aiplayersonline.com/CribBIGage/cards/${raw}_of_${suit.toLowerCase()}.svg`}
        width={width}
    />;
}

export const CardBackContext = React.createContext<Back>("red");
export type Back = "old" | "dragon" | "red" | "clam";
export const Backs: Back[] = ["old" , "dragon" , "red" , "clam"];

export const CardBack: React.FC<{ back?: Back, width: number }> = props => {
    const backContext = React.useContext(CardBackContext);
    const { back = backContext, width } = props;
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