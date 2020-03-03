import { Hand } from "./deal";
import { GameState } from "./game";
import { PlayerId } from "../components/stages/initAndWait";

export interface PlayerInfo {
    id?: number;
    name: string;
}

export interface PlayerState extends PlayerInfo {
    score: number;
    lastScore: number;
    hand: Hand;
    playedCards?: Hand;
    color: string;
}

// find the current player who needs to play
function GlobalCurrentPlayer(game: GameState): PlayerState | undefined {
    switch(game.stage){
        case "Deal":
            return getCurrentDealer(game);
        case "Play":
            return getCurrentPlayer(game);
        case "Cut":
            return getCurrentCutter(game);
    }
}

export function WasOrWere(player: PlayerState) { return IsYou(player) ? "were" : "was"; }

export function getPlayerByName(name: string, players: PlayerState[]){
    return players.find(p => p.name == name)!;
}

export const IsYou = (player: PlayerInfo): boolean => {
    return player.id == PlayerId;
}

export function ensureNextPlayer(game: GameState): number {
    if (!game.nextToPlay) {
        return 0;
    }

    return game.nextToPlay % game.players.length;
}

export function getCurrentPlayer(game: GameState): PlayerState {
    return game.players[ensureNextPlayer(game)];
}

export function getCurrentDealer(game: GameState): PlayerState {
    return game.players[game.players.length - 1];
}

export function getCurrentCutter(game: GameState): PlayerState {
    return game.players[game.players.length - 2];
}