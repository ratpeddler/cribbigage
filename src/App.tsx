import React from 'react';
import { AdvanceGameState } from './game/turns';
import { Game } from './components/game';
import { initGameState } from './game/game';
import { anyPlayerHasWon } from './game/score';
import { Horizontal2PlayerLayout } from './components/layouts/Horizontal_2Player';
import _ from 'lodash';
import { PlayLogContext, IPlayLogContext, ILog } from './components/playLog';
import { PlayerState } from './game/players';
import { IScore } from './components/scoreIcon';

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState());
  const [playLog, setPlayLog] = React.useState<ILog[]>([]);

  const addLog = React.useCallback((player: PlayerState | null, message: string, score?: IScore)=> {
    setPlayLog([{
      time: Date.now(),
      playerName: player?.name || "GAME",
      message,
      score,
    },
     ...playLog])
  }, [playLog, setPlayLog]);

  const PlayLogContextValue = React.useMemo<IPlayLogContext>(()=>({
    log: playLog,
    addLog,
  }), [playLog, addLog]);

  React.useEffect(() => {
    if (anyPlayerHasWon(gameState)) {
      setGameState(initGameState());
      setPlayLog([]);
    }
  }, [gameState, gameState.players]);

  //console.log(JSON.stringify(gameState));

  return (
      <PlayLogContext.Provider value={PlayLogContextValue}>
        <div style={{ position: "absolute", height: "100%", width: "100%", display: "flex" }}>
          <Game
            layout={Horizontal2PlayerLayout}
            game={gameState}
            setGameState={(newGame, advance) => {
              let game = newGame;
              if (advance) {
                game = AdvanceGameState(game);
              }

              setGameState(_.cloneDeep(game));
            }}
          />
        </div>
      </PlayLogContext.Provider>
  );
}

export default App;
