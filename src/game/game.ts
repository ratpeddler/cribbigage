import { Stage, NonGameStages } from "./turns";
import { Hand } from "./deal";
import { GameRules } from "./rules";
import { PlayerState, PlayerInfo } from "./players";

export interface GameState {
    rules: GameRules;

    // List of the players (current dealer is always LAST)
    players: PlayerState[];

    // Store who the dealer is (best by index or id or something)
    dealer?: number;

    /** Play/Peg stage only! The next person who needs to play a card. Used for tracking who will play */
    nextToPlay?: number;

    /** Play/Peg stage only! The last person who played a card. Used for tracking GO */
    lastToPlay?: number;

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