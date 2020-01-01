import { GameState } from "../game/game"
import _ from "lodash";
import { PlayerState } from "../game/players";
import { Hand } from "../game/deal";
import { IsYou } from "../components/stages/chooseGameMode";
import { scoreHand } from "../game/score";
import { getCurrentDealer } from "../game/play";

export function throwAI(player: PlayerState, game: GameState) {
    if (IsYou(player)) throw "Called AI to throw hand on player!";

    // TODO: factor in expected value from CUT and from CRIB
    const haveCrib = getCurrentDealer(game) == player;

    // go through and try scoring all the hands
    let maxScore = 0;
    let maxHand: Hand = [];
    allHands(player.hand, game.rules.keepSize).forEach(hand =>
        {
            const score = scoreHand(hand, []).score;
            if(score > maxScore){
                maxScore = score;
                maxHand = hand;
            }
        });

    return {
        keep: maxHand,
        discard: player.hand.filter((c, ci) => !maxHand.includes(c))
    };
}


// This should be basically right, but best to add some unit tests.
function allHands(hand: Hand, numberToKeep: number): Hand[] {
    return allSets(hand).filter(set => set.length == numberToKeep);
}


// This should be basically right, but best to add some unit tests.
function allSets<T extends number | string | object>(items: T[]): T[][] {
    if (items && items.length) {
        if (items.length == 1) {
            return [items];
        }

        let [x, ...rest] = items;
        let otherAdditions = allSets(rest);
        return [[x], ...otherAdditions.map(v => ([x, ...v])), ...otherAdditions ];
    }

    return [];
}

console.log(allSets);