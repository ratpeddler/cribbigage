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
    return <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
        <h1>Choose a game mode</h1>
        {GameModes.map(mode => <div key={mode.name}>
            <Button
                big={mode.name.indexOf("BIG") >= 0}
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
            </Button>
        </div>)}
    </div>
}