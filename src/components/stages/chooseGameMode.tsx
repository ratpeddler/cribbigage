import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { GameModes } from "../../game/rules";
import { startGame } from "../../game/game";
import logo from "./../../cribbigage.png";
import { PlayerInfo } from "../../game/players";
import { createTrack, createStraightSegment, createSpacer, create90Segment, create180Segment, Track } from "../track";

// Total hack for now
export const IsYou = (player: PlayerInfo): boolean => {
    return player.name == "You";
}

export const ChooseGameMode: GameComponent = props => {
    return <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
        <img alt="CribBIGage!" src={logo} style={{ maxWidth: "70%", flex: "auto", maxHeight: "30%" }} />
        <h1>Choose a game mode</h1>
        <Track 
            dots={createTrack([
                createStraightSegment(50, 50, 3, 3),
                createSpacer(10),
                createStraightSegment(70, 50, 3),
                createStraightSegment(70, 50, 3),
                createStraightSegment(70, 50, 3),
                create90Segment(70,50,3),
                create90Segment(70,50,3),
                createStraightSegment(70, 50, 3),
                createStraightSegment(70, 50, 3),
                createStraightSegment(70, 50, 3),
                create180Segment(70,50,3),
                createStraightSegment(70, 50, 3),
                createStraightSegment(70, 50, 3),
                createStraightSegment(70, 50, 3),
                createStraightSegment(35, 50, 1, 1),
            ])}
        />
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