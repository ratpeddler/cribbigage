import React from "react";
import { GameComponent, Game } from "../game";
import { Button } from "../button";
import { GameModes } from "../../game/rules";
import { startGame, initGameState } from "../../game/game";
import logo from "./../../cribbigage.png";
import { PlayerInfo, PlayerState } from "../../game/players";

// Total hack for now
export const IsYou = (player: PlayerInfo): boolean => {
    return player.name == "You";
}

export function WasOrWere(player: PlayerState) { return IsYou(player) ? "were" : "was"; }

export const ColoredSpan: React.FC<{ player?: PlayerState }> = props => {
    return <span style={{ color: props.player?.color }}>{props.children}</span>
}

export const ColoredDiv: React.FC<{ player?: PlayerState }> = props => {
    return <div style={{ color: props.player?.color }}>{props.children}</div>
}

export const GameOver: GameComponent = props => {
    const { game } = props;
    const { players, rules } = game;
    const { pointsToWin } = rules;
    const winner = players.find(p => p.score > pointsToWin);

    return <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
        <img alt="CribBIGage!" src={logo} style={{ maxWidth: "70%", flex: "auto", maxHeight: "30%" }} />
        <h1>{winner?.name} won!</h1>
        <ColoredDiv player={winner}>{winner?.name} scored {winner?.score} points</ColoredDiv>
        {players.map(player => {
            if (player == winner) { return null; }
            if (player.score < .5 * pointsToWin) {
                // double skunk
                return <h2 style={{ color: player.color }}>{player.name} {WasOrWere(player)} <b>DOUBLE</b> skunked  with only {player.score} points!</h2>
            }
            if (player.score < .75 * pointsToWin) {
                // double skunk
                return <h3 style={{ color: player.color }}>{player.name} {WasOrWere(player)} skunked with {player.score} points!</h3>
            }

            return <ColoredDiv player={player}>{player.name} lost with {player.score} points</ColoredDiv>;
        })}
        <Button
            onClick={() => {
                props.setGameState(initGameState(), false)
            }}>
            New Game?
        </Button>
    </div>
}