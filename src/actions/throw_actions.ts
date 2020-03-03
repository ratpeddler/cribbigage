import { GameState } from "../game/game";
import { PlayerState, IsYou, ensureNextPlayer } from "../game/players";
import _ from "lodash";
import { throwAI } from "../ai/AI_throw";
import { SetGameState } from "../components/game";
import { LocalOrMultiplayer } from "../components/stages/initAndWait";
import { incrementNextPlayer } from "../game/play";
import { KeepCard } from "../components/hand";

export function action_throwCardsToCrib(game: GameState, setGameState: SetGameState, cardsToKeep: KeepCard) {
    // get hands and discards for each player
    let players = _.cloneDeep(game.players);
    let crib = [...game.crib || []];

    if (LocalOrMultiplayer == "local") {
        for (let player of players) {
            if (IsYou(player)) {
                crib.push(...player.hand.filter(c => !cardsToKeep[c]));
                player.hand = player.hand.filter(c => cardsToKeep[c]);
            }
            else {
                const { keep, discard } = throwAI(player, game);
                crib.push(...discard);
                player.hand = keep;
            }
        }
        
        setGameState({
            ...game,
            players,
            crib,
        }, true); // Always advance locally, since we play the other's hands
    }
    else {
        // Ensure it is your turn to play
        const isYourTurn = IsYou(players[ensureNextPlayer(game)]);
        if (!isYourTurn) {
            throw "Can't throw cards when it isn't your turn!";
        }

        for (let player of players) {
            if (IsYou(player)) {
                crib.push(...player.hand.filter(c => !cardsToKeep[c]));
                player.hand = player.hand.filter(c => cardsToKeep[c]);
            }
        }

        // increment player and check if any one hasn't thrown
        game.nextToPlay = incrementNextPlayer(game);
        setGameState({
            ...game,
            players,
            crib,
        }, game.nextToPlay == 0); //only increment once we have gone all the way around (this assumes we start at 0)
    }

}