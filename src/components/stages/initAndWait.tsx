import React from "react";
import axios from "axios";
import _ from "lodash";

import { GameComponent } from "../game";
import { GameState, startGame } from "../../game/game";
import { Button } from "../button";
import { CribBIGage_2Hand, CribBIGage_3Hand, cribbage_3Hand, cribbage_2Hand } from "../../game/rules";
import { OldSchoolBoard } from "../../boards/tracks/oldschool";
import { PlayerInfo } from "../../game/players";

export var PlayerId = 0;
export var LocalOrMultiplayer: "local" | "online" = "local";

export const InitAndWait: GameComponent = props => {
    const { game, setGameState } = props;

    const checkGame = () => {
        axios.get("/CribBIGage/JoinGame").then(response => {
            const serverGameObject = response.data;
            console.log("join game response", serverGameObject);
            let serverPlayers = serverGameObject.player;
            let { playerCount, playerGoal, cribBIGage, length, gameId } = serverGameObject;
            // TODO: set PlayerId!
            // TODO: set up the game state and start the game
            // setGameState(newGameState.data);
            let NewPlayers: PlayerInfo[] = [];
            let CurPlayer = serverPlayers[playerCount - 1];
            PlayerId = PlayerId || CurPlayer.number;
            console.log("I think I am player " + PlayerId);
            if (playerGoal > 1) { LocalOrMultiplayer = "online"; console.log("I think this is an online game!") }

            let NewRules = _.cloneDeep(CribBIGage_2Hand);
            if (cribBIGage == "true") {
                if (playerGoal == 3) NewRules = _.cloneDeep(CribBIGage_3Hand)
                if (playerGoal == 4) NewRules = _.cloneDeep(CribBIGage_2Hand);
            }
            else {
                if (playerGoal == 2) NewRules = _.cloneDeep(cribbage_2Hand)
                if (playerGoal == 3) NewRules = _.cloneDeep(cribbage_3Hand);
            }
            NewRules.pointsToWin = length;
            let customizaton = {
                boardName: "Old School",
                deckName: "red"
            };
            if (playerGoal == 1) {
                console.log("solo vs AI");
                setGameState(
                    startGame([
                        { name: CurPlayer.name, id: PlayerId },
                        { name: "AI 1", },
                        { name: "AI 2", }],
                        NewRules,
                        {
                            boardName: "Old School",
                            deckName: "red"
                        }
                    ),
                    false);
            }
            else if (playerCount == playerGoal) {
                console.log("enough players starting the game");
                setGameState(
                    startGame(serverPlayers.filter((sp: any) => sp).map((sp: any) => ({ name: sp.name, id: sp.number } as PlayerInfo)),
                        NewRules,
                        customizaton as any
                    ),
                    false);
            }
            else {
                console.log("waiting for more players... 5 seconds till next call");
                setTimeout(() => {
                    checkGame();
                }, (1000));
            }
        });
    }

    checkGame();

    return <div>
        Waiting for players!!!
        <Button onClick={checkGame}>Check for players</Button>
    </div>
}
