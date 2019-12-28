import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { GameModes } from "../../game/rules";
import { startGame } from "../../game/game";
import { PlayerInfo } from "../../game/turns";

// Total hack for now
export const IsYou = (player: PlayerInfo): boolean => {
    return player.name == "You";
}

export const ChooseGameMode: GameComponent = props => {
    return <div>
        Choose a game mode
        {GameModes.map(mode => <Button
            key={mode.name}
            big={mode.name.indexOf("Big") >= 0}
            onClick={() => {
                props.setGameState(
                    startGame([
                        { name: "You" },
                        { name: "AI 1" },
                        { name: "AI 2" }],
                        mode),
                    false);
            }}
        >
            {mode.name}
        </Button>)}
    </div>
}