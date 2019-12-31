import { Hand } from "./deal";

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