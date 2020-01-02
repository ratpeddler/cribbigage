import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { GameModes } from "../../game/rules";
import { startGame } from "../../game/game";
import logo from "./../../cribbigage.png";
import { PlayerInfo } from "../../game/players";

// Total hack for now
export const IsYou = (player: PlayerInfo): boolean => {
    return player.name == "You";
}

export const ChooseGameMode: GameComponent = props => {
    return <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
        <img alt="CribBIGage!" src={logo} style={{ maxWidth: "70%", flex: "auto", maxHeight: "30%" }} />
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
        <p>Copyright &copy; 2020 AIPlayersOnline.com</p>
    </div>
   }