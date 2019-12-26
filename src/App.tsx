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

  const score = scoreHand(hands[0], cut);

  return (
    <div>
      <ScoreBoard scores={scores} />
      Crib!
      <Hand cards={crib} />

      Cut!
      <Hand cards={cut} />

      {hands.map((cards, index) => index == 0 && <Hand cards={cards} key={index} maxKeep={discardUntil} />)}

      {/* Display the scores for now while finishing scoring */}
      {!!score.score && <div>SCORE: {score.score}</div>}
      {!!score.fifteen && <div>fifteen: {score.fifteen}</div>}
      {!!score.pairs && <div>pairs: {score.pairs}</div>}
      {!!score.knobs && <div>knobs: {score.knobs}</div>}
      {!!score.runs && <div>runs: {score.runs}</div>}
      {!!score.flush && <div>flush: {score.flush}</div>}
    </div>
  );
}

export default App;
