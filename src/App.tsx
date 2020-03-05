import React from 'react';
import { AdvanceGameState } from './game/turns';
import { Game } from './components/game';
import { initGameState, GameState } from './game/game';
import { anyPlayerHasWon } from './game/score';
import { Horizontal2PlayerLayout } from './components/layouts/Horizontal_2Player';
import _ from 'lodash';
import { PlayLogContext, IPlayLogContext, ILog } from './components/playLog';
import { PlayerState, getCurrentPlayer, IsYou } from './game/players';
import { IScore } from './components/scoreIcon';
import { playTapSound } from './sounds/playSound';
import { CardBackContext } from './components/card';
import axios from "axios";
import { LocalOrMultiplayer } from './components/stages/initAndWait';
import { Button } from './components/button';

export const LoadGameFromServer = () => axios.get<GameState>("PlayGame").then(response => response.data);

const App: React.FC = () => {
  const [waitingForServer, setWaitingForServer] = React.useState(false);
  const [gameState, setGameState] = React.useState(initGameState());
  const [playLog, setPlayLog] = React.useState<ILog[]>([]);

  const addLog = React.useCallback((player: PlayerState | null, message: string, score?: IScore) => {
    setPlayLog([{
      time: Date.now(),
      playerName: player?.name || "GAME",
      message,
      score,
    },
    ...playLog])
  }, [playLog, setPlayLog]);

  const PlayLogContextValue = React.useMemo<IPlayLogContext>(() => ({
    log: playLog,
    addLog,
  }), [playLog, addLog]);

  const refreshGame = (currentGame: GameState, timeout = 1) => {
    axios.get<GameState>("PlayGame").then(newGameState => {
      // this call may have timed out before the other player(s) have moved.
      if (currentGame != null && _.isEqual(currentGame, newGameState.data)) {
        // they are still the same. This LIKELY indicates that we should call again. But there could always be edge cases for this...
        console.warn(`still refreshing so lets wait ${timeout} seconds and check again`);
        setTimeout(() => {
          refreshGame(currentGame, timeout * 1.33);
        }, timeout * 1000);

      }
      else {
        console.log("game states changed. stopping refresh and updating state.")
        setGameState(newGameState.data);
        setPlayLog([]);
        setWaitingForServer(false);
      }
    });
  }

  const currentPlayer = !!gameState && getCurrentPlayer(gameState);
  const isYourTurn = !!currentPlayer && IsYou(currentPlayer);

  return (
    <PlayLogContext.Provider value={PlayLogContextValue}>
      <CardBackContext.Provider value={gameState.customization.deckName}>

        <div style={{ position: "absolute", height: "100%", width: "100%", display: "flex" }}>
          {LocalOrMultiplayer == "online" ? <Button disabled={waitingForServer} onClick={() => {
            setWaitingForServer(true);
            refreshGame(gameState);
          }}>
            {isYourTurn ? "Wait for other player" : "(BUG: Refresh)"}</Button> : null}
          <Game
            waitingForServer={waitingForServer}
            layout={Horizontal2PlayerLayout}
            game={gameState}
            setGameState={(newGame, advance) => {
              let game = newGame;
              if (advance) {
                game = AdvanceGameState(game);
                playTapSound();
              }

              // update based on local or onlu
              if (LocalOrMultiplayer == "online") {
                // TODO: Send to server and update with the response
                // TODO: check if it is our turn, if so play a little whistle
                setWaitingForServer(true);
                setGameState(game);

                // Send the "new" play log to the server.
                axios.post<GameState>("PlayGame", { ...game, playLog: [...(game.playLog || []), ...playLog] }).then(postResponse => {
                  refreshGame(game);
                });
              }
              else {
                setGameState(_.cloneDeep(game));
              }
            }}
          />
          <div style={{ position: "fixed", bottom: 0, right: 0, padding: 10, fontSize: 10 }}>© 2020 aiplayersonline.com</div>
        </div>
      </CardBackContext.Provider>
    </PlayLogContext.Provider>
  );
}

export default App;
