import { GameState } from "../game/game";
import { IScoreContext } from "../components/scoreIcon";
import { IPlayLogContext } from "../components/playLog";
import { ensureNextPlayer, getCurrentPlayer, getPlayableHand, cantPlayAtAll, pass, sumCards, canPlay, playCard } from "../game/play";
import { IsYou } from "../components/stages/chooseGameMode";
import { parseCard } from "../game/card";
import _ from "lodash";

/** Play the AI players NOT A PURE FUNCTION */
export function playAI(game: GameState, autoAdvanceUntilPlayer = false, scoreContext?: IScoreContext, logContext?: IPlayLogContext): GameState {
    game = _.cloneDeep(game);
    // Start at the next person who needs to play
    game.nextToPlay = ensureNextPlayer(game);

    let keepRunning = true;
    while (!IsYou(getCurrentPlayer(game)) && keepRunning) {
        console.log("playing ai " + getCurrentPlayer(game).name);
        if (!autoAdvanceUntilPlayer) { keepRunning = false; }
        game.nextToPlay = ensureNextPlayer(game); // Not sure if needed anymore..

        // Get current player and hand
        const player = getCurrentPlayer(game);
        const hand = getPlayableHand(player, game);
        const { playedCards = [], previousPlayedCards = [] } = game;

        if (cantPlayAtAll(player, playedCards, previousPlayedCards)) {
            console.log(player.name + " said GO");
            game = pass(game, scoreContext, logContext);
            continue;
        }

        const currentCount = sumCards(playedCards);
        const prevCard = playedCards[playedCards.length - 1];
   
        // Common cases to greedily play
        let cardPlayed = false;
        for (let card of hand) {  
            const cp = parseCard(card);
            if (currentCount + cp.count === 15 && canPlay(playedCards, card)) { // Going for a greedy 15 peg
                game = playCard(game, card, scoreContext, logContext);
                cardPlayed = true;
                console.log("Greedy 15 play")
                break;
            }
            if (currentCount + cp.count === 31 && canPlay(playedCards, card)) { // Going for a greedy 15 peg
                game = playCard(game, card, scoreContext, logContext);
                cardPlayed = true;
                console.log("Greedy 31 play")
                break;
            }
        } 

        // Common cases to avoid
        if (cardPlayed) continue;
        for (let card of hand) {
            const cp = parseCard(card);
            const pcp = prevCard != undefined && parseCard(prevCard);

            if (currentCount + cp.count === 5) {
                console.log("Avoid 5 count");
                continue; // Avoid 5 Count
            }
            if (currentCount + cp.count === 21) {
                console.log("Avoid 21 count");
                continue; // Avoid 21
            }
            if (pcp && (pcp.rank === cp.rank - 1 || pcp.rank === cp.rank + 1)) {
                console.log("Avoid 2 card sequence")
                continue; // Avoid 2 card sequences
            }
            if (canPlay(playedCards, card)) {
                game = playCard(game, card, scoreContext, logContext);
                cardPlayed = true;
                break;
            }
        }

        // In case you can't avoid the bad situations
        if (cardPlayed) continue;
       console.log("fallback and play a card");
        for (let card of hand) {
            if (canPlay(playedCards, card)) {
                game = playCard(game, card, scoreContext, logContext);
                break;
            }
        } 
    }

    return game;
}