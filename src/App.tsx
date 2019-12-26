import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { Hand } from './components/hand';
import { deal, createDeck } from './game/deal';
import { scoreHand } from './game/score';

const players = 2; // Number of players
const handSize = 5; // Dealt hand size to each player
const dealerExtra = 0; // For 3 hand
const cribExtra = 0; // For CribBIGage
const discardUntil = 4;

const App: React.FC = () => {
  const [scores] = React.useState([0, 0]);
  const { hands, crib, cut } = deal(createDeck(), players, handSize, dealerExtra, cribExtra);


  return (
    <div>
      <ScoreBoard scores={scores} />
      Crib!
      <Hand cards={crib} />

      Cut!
      <Hand cards={cut} />

      {hands.map((cards, index) => <Hand cards={cards} key={index} maxKeep={discardUntil} cut={cut} />)}

    </div>
  );
}

export default App;
