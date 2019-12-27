import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { deal, createDeck } from './game/deal';
import { initGameState, AdvanceGameState } from './game/turns';
import { Game } from './components/game';

const players = 2; // Number of players
const handSize = 6; // Dealt hand size to each player
const dealerExtra = 0; // For 3 hand
const cribExtra = 0; // For CribBIGage

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState([{ name: "Peter" }, { name: "Alex" }]))

  console.log(JSON.stringify(gameState));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ScoreBoard players={gameState.players} />

      <div style={{ minHeight: 500, display: "flex", flex: "auto", alignItems: "center", justifyContent: "center" }}>
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
