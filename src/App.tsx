import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { AdvanceGameState } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";
import { initGameState } from './game/game';

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState());
  console.log(JSON.stringify(gameState));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <img src={logo} width={200} style={{ position: "absolute", top: 30, left: 20 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ScoreBoard players={gameState.players} />
      </div>

      <div style={{ minHeight: 300, display: "flex", flex: "auto", alignItems: "center", justifyContent: "center" }}>
        <Game
          game={gameState}
          setGameState={(newGame, advance) => {
            let game = newGame;
            console.log(game);

            if (advance) {
              game = AdvanceGameState(game);
              console.log("advancing", game);
            }

            setGameState(game);
          }}
        />
      </div>
    </div>
  );
}

export default App;
