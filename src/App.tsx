import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { Hand } from './components/hand';
import { deal, createDeck } from './game/deal';
import { scoreHand } from './game/score';
import { GameState, initGameState } from './game/turns';
import { Game } from './components/game';

const players = 2; // Number of players
const handSize = 6; // Dealt hand size to each player
const discardUntil = 4; // Hand size after discarding to crib
const dealerExtra = 0; // For 3 hand
const cribExtra = 0; // For CribBIGage

const App: React.FC = () => {
  const [scores] = React.useState([0, 0]);
  const { hands, crib, cut } = deal(createDeck(), players, handSize, dealerExtra, cribExtra);

  const [gameState, setGameState] = React.useState(initGameState(players))


  return (
    <div>
      <ScoreBoard scores={scores} />
      Crib!
      <Hand cards={crib} />

      Cut!
      <Hand cards={cut} />

      {hands.map((cards, index) => <Hand cards={cards} key={index} maxKeep={discardUntil} cut={cut} />)}

      <Game game={gameState} />
    </div>
  );
}

export default App;
