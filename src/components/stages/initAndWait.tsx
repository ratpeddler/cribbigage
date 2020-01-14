import React from "react";
import axios from "axios";
import _ from "lodash";

import { GameComponent } from "../game";
import { startGame } from "../../game/game";
import { Button } from "../button";
import { CribBIGage_2Hand, CribBIGage_3Hand, cribbage_3Hand, cribbage_2Hand } from "../../game/rules";
import { PlayerInfo } from "../../game/players";

export var PlayerId = 0;
export var LocalOrMultiplayer: "local" | "online" = "local";

export const InitAndWait: GameComponent = props => {
    const { setGameState } = props;

    const checkGame = () => {
        axios.get("JoinGame").then(response => {
            const serverGameObject = response.data;
            console.log("join game response", serverGameObject);
            let serverPlayers = serverGameObject.player;
            let { playerCount, playerGoal, cribBIGage, length } = serverGameObject;
            let CurPlayer = serverPlayers[playerCount - 1];
            PlayerId = PlayerId || CurPlayer.number;
            console.log("I think I am player " + PlayerId);
            if (playerGoal > 1) { LocalOrMultiplayer = "online"; console.log("I think this is an online game!") }
            console.log("cribBIGage=" + cribBIGage) ;
            let NewRules = _.cloneDeep(CribBIGage_2Hand);
            if (cribBIGage == true) {
                console.log("Playing by CribBIGage rules") ;
                if (playerGoal == 3 || playerGoal == 1) NewRules = _.cloneDeep(CribBIGage_3Hand)
                if (playerGoal == 4 || playerGoal == 0) NewRules = _.cloneDeep(CribBIGage_2Hand);
            }
            else {
                if (playerGoal == 2 || playerGoal == 0) NewRules = _.cloneDeep(cribbage_2Hand)
                if (playerGoal == 3 || playerGoal == 1) NewRules = _.cloneDeep(cribbage_3Hand);
            }
            NewRules.pointsToWin = length;
            let customizaton = {
                boardName: "Old School",
                deckName: "red"
            };
            if (playerGoal == 0) {
                console.log("solo vs AI");
                setGameState(
                    startGame([
                        { name: CurPlayer.name, id: PlayerId },
                        { name: "AI 1", },
                        ],
                        NewRules,
                        {
                            boardName: "Old School",
                            deckName: "red"
                        }
                    ),
                    false);
            }
            else if (playerGoal == 1) {
                console.log("solo vs 2 AI");
                setGameState(
                    startGame([
                        { name: CurPlayer.name, id: PlayerId },
                        { name: "AI 1", },
                        { name: "AI 2", }],
                        NewRules,
                        {
                            boardName: "Around the Back 120",
                            deckName: "dragon"
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
                }, (5000));
            }
        });
    }

    checkGame();

    return <div>
        Waiting for players!!!
        <Button onClick={checkGame}>Check for players</Button>
    </div>
}
