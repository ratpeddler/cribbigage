import { Stage, NonGameStages } from "./turns";
import { Hand, shuffle } from "./deal";
import { GameRules } from "./rules";
import { PlayerState, PlayerInfo } from "./players";
import { Back } from "../components/card";
import { LocalOrMultiplayer } from "../components/stages/initAndWait";
import { ILog } from "../components/playLog";

// interface for the "JoinGame" api response
export interface JoinGameResponse {
    cribBIGage: boolean
    cribComplete: boolean
    gameId: number
    gameOver: boolean
    handCount: number
    handSubmittedCount: number
    length: number
    name: string
    player: { name: string, number: number, score: number }[]
    playerCount: number
    playerGoal: number
    state: "NEW" | string
}

export interface GameCustomization {
    boardName: string;
    deckName: Back;
}

export interface GameState {
    gameId?: string;

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

    customization: GameCustomization;

    playLog: ILog[];
}

export function initGameState(): GameState {
    return {
        stage: "InitAndWait",
        players: [] as PlayerInfo[],
        customization: {}
    } as GameState;
}

const colors = ["red", "green", "blue", "gold"];
export function startGame(players: PlayerInfo[], rules: GameRules, customization: GameCustomization): GameState {
    if (LocalOrMultiplayer == "local") {
        players = shuffle(players.filter((p, pi) => pi < rules.players));
    }

    return {
        rules,
        turnNumber: 0,
        players: players.map((player, pi) => ({ ...player, color: colors[pi], score: 0, lastScore: 0, hand: [] })),
        stage: "Deal",
        crib: [],
        cut: [],
        playedCards: [],
        customization,
        playLog: [],
    }
}