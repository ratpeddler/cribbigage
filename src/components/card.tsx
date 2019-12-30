
import React from "react";
import { parseCard, parseNumericalValue } from "../game/card";

export const Card: React.FC<{ card: number, index: number, selected?: boolean, onClick?: () => void, stacked?: boolean }> = props => {
    const { card, selected, onClick, stacked } = props;
    const { value, suit } = parseCard(card);
    const raw = parseNumericalValue(card);

    const margin = 5;
    const width = 120;

    return <div
        style={{
            margin,
            marginLeft: stacked ? -100 : margin,
            border: selected ? "5px solid lightblue" : "5px solid transparent",
            borderRadius: 10,
            cursor: onClick ? "pointer" : undefined,
        }}
        onClick={onClick}
    >
        <img
            alt={`${value} of ${suit}`}
            src={`https://aiplayersonline.com/CribBIGage/cards/${raw}_of_${suit.toLowerCase()}.svg`}
            width={width} />
    </div>;
}