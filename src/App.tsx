import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { Hand } from './components/hand';
import { deal, createDeck } from './game/deal';

const App: React.FC = () => {
  const [scores, setScores] = React.useState([0, 0]);
  const { hands, crib, cut } = deal(createDeck());

  return (
    <div>
      <ScoreBoard scores={scores} />
      {hands.map((cards, index) => <Hand cards={cards} key={index} />)}
    </div>
  );
}

export default App;
