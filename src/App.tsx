import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { initGameState, AdvanceGameState } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";

const players = 2; // Number of players
const handSize = 6; // Dealt hand size to each player
const dealerExtra = 0; // For 3 hand
const cribExtra = 0; // For CribBIGage

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState([{ name: "Peter" }, { name: "Alex" }]))
  console.log(JSON.stringify(gameState));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <img src={logo} width={200} style={{position: "absolute", top: 30, left: 20}}/>
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
