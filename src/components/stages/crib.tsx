import React from "react";
import { GameComponent } from "../game";
import { HandScore } from "../handScore";
import { Hand } from "../hand";
import { Button } from "../button";
import { scoreHand } from "../../game/score";

export const Crib: GameComponent = props => {
    return <div>
        Cut:
        <Hand cards={props.game.cut!} />

        Score of crib:
        <Hand cards={props.game.crib!} />
        <HandScore hand={props.game.crib!} cut={props.game.cut} />

        <Button onClick={() => {
            // last player is always dealer
            let players = [...props.game.players];
            let last = players.pop()!;
            last = {
                ...last,
                score: last.score + scoreHand(props.game.crib!, props.game.cut!).score
            };
            
            players.push(last);

            props.setGameState({
                ...props.game,
                players
            }, true);
        }}>Next</Button>
    </div>;
}