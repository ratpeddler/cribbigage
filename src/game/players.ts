import { Hand } from "./deal";
import { GameState } from "./game";

export interface PlayerInfo {
    name: string;

    // Can add things like USERID etc here in the future or leave as is
}

export interface PlayerState extends PlayerInfo {
    score: number;
    lastScore: number;
    hand: Hand;
    playedCards?: Hand;
    color: string;
}

export function getPlayerByName(name: string, players: PlayerState[]){
    return players.find(p => p.name == name)!;
}

// Total hack for now
export const IsYou = (player: PlayerInfo): boolean => {
    return player.name == "You";
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