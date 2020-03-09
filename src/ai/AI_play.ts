import { GameState } from "../game/game";
import { IPlayLogContext } from "../components/playLog";
import { getPlayableHand, cantPlayAtAll, pass, sumCards, canPlay, playCard } from "../game/play";
import { parseCard } from "../game/card";
import _ from "lodash";
import { ensureNextPlayer, IsYou, getCurrentPlayer } from "../game/players";

/** Play the AI players NOT A PURE FUNCTION */
export function playAI(game: GameState, autoAdvanceUntilPlayer = false, logContext: IPlayLogContext): GameState {
    game = _.cloneDeep(game);
    // Start at the next person who needs to play
    game.nextToPlay = ensureNextPlayer(game);

    let keepRunning = true;
    while (!IsYou(getCurrentPlayer(game)) && keepRunning) {
        if (!autoAdvanceUntilPlayer) { keepRunning = false; }
        game.nextToPlay = ensureNextPlayer(game); // Not sure if needed anymore..

        // Get current player and hand
        const player = getCurrentPlayer(game);
        const hand = getPlayableHand(player, game);
        const { playedCards = [], previousPlayedCards = [] } = game;

        if (cantPlayAtAll(player, playedCards, previousPlayedCards)) {
            game = pass(game, logContext);
            continue;
        }

        const currentCount = sumCards(playedCards);
        const prevCard = playedCards[playedCards.length - 1];

        // Common cases to greedily play
        let cardPlayed = false;
        for (let card of hand) {
            const cp = parseCard(card);
            if (currentCount + cp.count === 15 && canPlay(playedCards, card)) { // Going for a greedy 15 peg
                game = playCard(game, player, card, logContext);
                cardPlayed = true;
                //console.log("Greedy 15 play")
                break;
            }
            if (currentCount + cp.count === 31 && canPlay(playedCards, card)) { // Going for a greedy 15 peg
                game = playCard(game, player, card, logContext);
                cardPlayed = true;
                //console.log("Greedy 31 play")
                break;
            }
        }

        // Common cases to avoid
        if (cardPlayed) continue;
        for (let card of hand) {
            const cp = parseCard(card);
            const pcp = prevCard != undefined && parseCard(prevCard);

            if (currentCount + cp.count === 5) {
                //console.log("Avoid 5 count");
                continue; // Avoid 5 Count
            }
            if (currentCount + cp.count === 21) {
                //console.log("Avoid 21 count");
                continue; // Avoid 21
            }
            if (pcp && (pcp.rank === cp.rank - 1 || pcp.rank === cp.rank + 1)) {
                //console.log("Avoid 2 card sequence")
                continue; // Avoid 2 card sequences
            }
            if (canPlay(playedCards, card)) {
                game = playCard(game, player, card, logContext);
                cardPlayed = true;
                break;
            }
        }

        // In case you can't avoid the bad situations
        if (cardPlayed) continue;
        //console.log("fallback and play a card");
        for (let card of hand) {
            if (canPlay(playedCards, card)) {
                game = playCard(game, player, card, logContext);
                break;
            }
        }
    }

    return game;
}