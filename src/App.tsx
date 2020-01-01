import React from 'react';
import { AdvanceGameState, isGameStage } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";
import { initGameState } from './game/game';
import { anyPlayerHasWon } from './game/score';
import { Horizontal2PlayerLayout } from './components/layouts/Horizontal_2Player';
import { ScoreContext, ScoreLookup, IScoreContext } from './components/scoreIcon';

let scoreLookup: ScoreLookup = {};

const App: React.FC = () => {
  const [scoreLookup, setScoreLookup] = React.useState<ScoreLookup>({});
  const [gameState, setGameState] = React.useState(initGameState());
  React.useEffect(() => {
    if (anyPlayerHasWon(gameState)) {
      setGameState(initGameState());
    }
  }, [gameState, gameState.players]);

  // console.log(JSON.stringify(gameState));

  // Some race conditions here!
  const scoreContext = React.useMemo<IScoreContext>(() => {
    return {
      lookup: scoreLookup,
      addPlayerScore: (player, score) => {
        setScoreLookup({ [player.name]: score });
      }
    };
  }, [scoreLookup, setScoreLookup]);

  return (
    <ScoreContext.Provider value={scoreContext}>
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

            setGameState(game);
          }}
        />
      </div>
    </ScoreContext.Provider>
  );
}

export default App;
