import React from 'react';
import { AdvanceGameState } from './game/turns';
import { Game } from './components/game';
import { initGameState, GameState } from './game/game';
import { anyPlayerHasWon } from './game/score';
import { Horizontal2PlayerLayout } from './components/layouts/Horizontal_2Player';
import _ from 'lodash';
import { PlayLogContext, IPlayLogContext, ILog } from './components/playLog';
import { PlayerState } from './game/players';
import { IScore } from './components/scoreIcon';
import { playTapSound } from './sounds/playSound';
import { CardBackContext } from './components/card';
import axios from "axios";

const App: React.FC = () => {
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

  return (
    <PlayLogContext.Provider value={PlayLogContextValue}>
      <CardBackContext.Provider value={gameState.customization.deckName}>

        <div style={{ position: "absolute", height: "100%", width: "100%", display: "flex" }}>
          <Game
            layout={Horizontal2PlayerLayout}
            game={gameState}
            setGameState={(newGame, advance) => {
              let game = newGame;
              if (advance) {
                game = AdvanceGameState(game);
                playTapSound();
              }

              // Look for game id in the query string
              let params = (new URL(document.location as any)).searchParams;
              let gameId = params.get('gameId');
              if (gameId) {
                // Send to the server
                console.log("Found game id", gameId);
                axios.post<GameState>("/CribBIGage/PlayGame/", { ...game, gameId }).then(newGameState => {
                  if (!_.isEqual(newGameState.data, gameState)) {
                    setGameState(newGameState.data);
                  }
                })
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
