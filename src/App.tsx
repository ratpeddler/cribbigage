import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { deal, createDeck } from './game/deal';
import { initGameState } from './game/turns';
import { Game } from './components/game';

const players = 2; // Number of players
const handSize = 6; // Dealt hand size to each player
const dealerExtra = 0; // For 3 hand
const cribExtra = 0; // For CribBIGage

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState([{ name: "Peter" }, { name: "Alex" }]))

  console.log(gameState);

  return (
    <div>
      <ScoreBoard players={gameState.players} />

      <Game game={gameState} setGameState={setGameState} />
    </div>
  );
}

export default App;
