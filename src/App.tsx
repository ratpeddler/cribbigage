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
import { LocalOrMultiplayer } from './components/stages/initAndWait';
import { Button } from './components/button';

export const LoadGameFromServer = () => axios.get<GameState>("PlayGame").then(response => response.data);

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


  const refreshGame = () => {
    axios.get<GameState>("PlayGame").then(newGameState => {
      setGameState(newGameState.data);
    });
  }

  return (
    <PlayLogContext.Provider value={PlayLogContextValue}>
      <CardBackContext.Provider value={gameState.customization.deckName}>

        <div style={{ position: "absolute", height: "100%", width: "100%", display: "flex" }}>
          {LocalOrMultiplayer == "online" ? <Button onClick={refreshGame}>REFRESH</Button> : null}
          <Game
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
                // TODO: check if it is our turn
                // if not out turn just poll for get

                axios.post<GameState>("PlayGame", game).then(newGameState => {
                  refreshGame();
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
