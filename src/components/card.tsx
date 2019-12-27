
import React from "react";
import { parseCard, parseNumericalValue } from "../game/card";

export const Card: React.FC<{ card: number, index: number, throw?: boolean, onClick?: () => void }> = props => {
    const { value, suit, count } = parseCard(props.card);
    const raw = parseNumericalValue(props.card);

    const margin = 10;
    const width = 150;
    const height = 215;

    return <div
        style={{
            position: "relative",
            margin,
            border: props.throw ? "5px solid transparent" : "5px solid lightblue",
            borderRadius: 10,
            cursor: props.onClick ? "pointer" : undefined,
        }}
        onClick={props.onClick}
    >
        <img
            style={{ zIndex: 10, position: "absolute", margin }}
            src={`https://aiplayersonline.com/CribBIGage/cards/${raw}_of_${suit.toLowerCase()}.svg`}
            width={width} />
        <div style={{
            zIndex: 1,
            color: suit == "Diamonds" || suit == "Hearts" ? "red" : "black",
            alignItems: "center",
            textAlign: "center",
            minWidth: width,
            minHeight: height,
            padding: margin
        }}
        >
            <div>{value}</div>
            <div>{suit}</div>
        </div>
    </div>;
}