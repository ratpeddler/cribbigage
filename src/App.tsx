import React from 'react';
import { AdvanceGameState, isGameStage } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";
import { initGameState } from './game/game';
import { anyPlayerHasWon } from './game/score';
import { Horizontal2PlayerLayout } from './components/layouts/Horizontal_2Player';

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState());
  React.useEffect(() => {
    if (anyPlayerHasWon(gameState)) {
      setGameState(initGameState());
    }
  }, [gameState, gameState.players]);

  console.log(JSON.stringify(gameState));

  return (
    <div style={{ position: "absolute", height: "100%", width: "100%", display: "flex" }}>
      <Game
        layout={Horizontal2PlayerLayout}
        game={gameState}
        setGameState={(newGame, advance) => {
          let game = newGame;
          if (advance) {
            game = AdvanceGameState(game);
          }

          setGameState(game);
        }}
      />
    </div>
  );
}

export default App;
