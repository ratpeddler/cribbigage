import React from 'react';
import { ScoreBoard } from './components/scoreboard';
import { AdvanceGameState, isGameStage } from './game/turns';
import { Game } from './components/game';
import logo from "./cribbigage.png";
import { initGameState } from './game/game';
import { DeckAndCut } from './components/deckAndCut';

const App: React.FC = () => {
  const [gameState, setGameState] = React.useState(initGameState());
  //console.log(JSON.stringify(gameState));

  return (
    <div style={{ position: "absolute", height: "100%", width: "100%" }}>

      <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>

        {isGameStage(gameState) && <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <DeckAndCut game={gameState.stage != "Throw" ? gameState : undefined} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <ScoreBoard players={gameState.players} />
          </div>
        </div>}

        <div style={{ minHeight: 300, display: "flex", flex: "auto", flexDirection: "row", overflow: "auto" }}>
          <div style={{ display: "flex", flex: "auto", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
            <Game
              game={gameState}
              setGameState={(newGame, advance) => {
                let game = newGame;
                if (advance) {
                  game = AdvanceGameState(game);
                  //console.log("New Stage", game.stage);
                }

                setGameState(game);
              }}
            />
          </div>
          <div>
            {/* Status area! show last couple actions! */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
