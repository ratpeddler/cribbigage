import React from 'react';
import { AdvanceGameState, isGameStage } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";
import { initGameState } from './game/game';
import { anyPlayerHasWon } from './game/score';
import { Horizontal2PlayerLayout } from './components/layouts/Horizontal_2Player';
import { ScoreContext, ScoreLookup, IScoreContext, createScoreMessage } from './components/scoreIcon';
import _ from 'lodash';
import { PlayLogContext, IPlayLogContext } from './components/playLog';
import { PlayerState } from './game/players';

const App: React.FC = () => {
  const [scoreLookup, setScoreLookup] = React.useState<ScoreLookup>({});
  const [gameState, setGameState] = React.useState(initGameState());
  const [playLog, setPlayLog] = React.useState(["Game started. Have fun!"]);

  const addPlayLog = React.useCallback((player: PlayerState | null, newLog: string)=> {
    setPlayLog([(player ? player?.name + " " : "") + newLog, ...playLog])
  }, [playLog, setPlayLog]);

  const PlayLogContextValue = React.useMemo<IPlayLogContext>(()=>({
    log: playLog,
    addPlayLog
  }), [playLog, addPlayLog]);

  React.useEffect(() => {
    if (anyPlayerHasWon(gameState)) {
      setGameState(initGameState());
    }
  }, [gameState, gameState.players]);

  console.log(JSON.stringify(gameState));

  // Some race conditions here!
  const scoreContext = React.useMemo<IScoreContext>(() => {
    return {
      lookup: scoreLookup,
      addPlayerScore: (player, score) => {
        if(score.score > 0){
          addPlayLog(player, createScoreMessage(score));
        }

        setScoreLookup({ [player.name]: score });
      }
    };
  }, [scoreLookup, setScoreLookup]);

  return (
    <ScoreContext.Provider value={scoreContext}>
      <PlayLogContext.Provider value={PlayLogContextValue}>
        <div style={{ position: "absolute", height: "100%", width: "100%", display: "flex" }}>
          <Game
            layout={Horizontal2PlayerLayout}
            game={gameState}
            setGameState={(newGame, advance) => {
              let game = newGame;
              if (advance) {
                // clear the scores for clarity
                scoreContext.addPlayerScore(game.players[0], { score: 0 });
                game = AdvanceGameState(game);
              }

              // this is where to check for player score changes

              let oldAndNew = gameState.players.map(p => {
                // find old player
                return {
                  old: p,
                  new: newGame.players.find(op => op.name == p.name)
                }
              });

              for (let item of oldAndNew) {
                if (item.new?.score != item.old?.score) {
                  console.log(`${item?.new?.name}'s score change from ${item.old?.score} to ${item.new?.score}`);
                }
              }

              setGameState(_.cloneDeep(game));
            }}
          />
        </div>
      </PlayLogContext.Provider>
    </ScoreContext.Provider>
  );
}

export default App;
