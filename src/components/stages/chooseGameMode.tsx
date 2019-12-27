import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { GameModes } from "../../game/rules";
import { startGame } from "../../game/game";

export const ChooseGameMode: GameComponent = props => {
    return <div>
        Choose a game mode
        {GameModes.map(mode => <Button
            key={mode.name}
            big={mode.name.indexOf("Big") >= 0}
            onClick={() => {
                props.setGameState(
                    startGame([
                        { name: "Peter" },
                        { name: "Alex" },
                        { name: "Nancy" }],
                        mode),
                    false);
            }}
        >
            {mode.name}
        </Button>)}
    </div>
}