import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { AdvanceGameState, isGameStage } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";
import { initGameState } from './game/game';

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState());
  //console.log(JSON.stringify(gameState));

  return (
    <div style={{ position: "absolute", height: "100%", width: "100%" }}>

      <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>

        {isGameStage(gameState) && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
          <ScoreBoard players={gameState.players} />
        </div>}

        <div style={{ minHeight: 300, display: "flex", flex: "auto", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
          <Game
            game={gameState}
            setGameState={(newGame, advance) => {
              let game = newGame;
              if (advance) {
                game = AdvanceGameState(game);
                console.log("advancing", game);
              }

              setGameState(game);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
