import React from "react";

export const Button: React.FC<{ onClick: () => void, disabled?: boolean, big?: boolean }> = props => {
    return <button
        style={{ fontSize: 25, padding: props.big ? 25 : 15, margin: 10 }}
        disabled={props.disabled}
        onClick={props.onClick}
    >
        {props.children}
    </button>;
}