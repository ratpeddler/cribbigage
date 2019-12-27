import { PlayerState, Stage, PlayerInfo, NonGameStages } from "./turns";
import { Hand } from "./deal";
import { GameRules } from "./rules";

export interface GameState {
    rules: GameRules;

    // List of the players (current dealer is always LAST)
    players: PlayerState[];

    // Current turn number
    turnNumber: number;

    // Current Stage
    stage: Stage | NonGameStages;

    // Current Crib
    crib?: Hand;

    // Current Cut
    cut?: Hand;

    // Current played cards
    playedCards?: Hand;

    // Cards from previous plays (sets of 31)
    previousPlayedCards?: Hand;
}

export function initGameState(): GameState {
    return {
        stage: "ChooseGameMode",
        players: [] as PlayerInfo[],
    } as GameState;
}

export function startGame(players: PlayerInfo[], rules: GameRules): GameState {
    return {
        rules,
        turnNumber: 0,
        players: players.filter((p, pi) => pi < rules.players).map(player => ({ ...player, score: 0, lastScore: 0, hand: [] })),
        stage: "Deal",
        crib: [],
        cut: [],
        playedCards: [],
    }
}