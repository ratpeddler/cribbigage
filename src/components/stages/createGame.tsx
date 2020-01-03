import React from "react";
import { GameComponent } from "../game";
import { Button } from "../button";
import { CribBIGage_2Hand, GameRules, CribBIGage_3Hand, cribbage_2Hand, cribbage_3Hand } from "../../game/rules";
import { startGame } from "../../game/game";
import logo from "./../../cribbigage.png";
import { Track, TrackDefinition } from "../track";
import { OldSchoolBoard } from "../../boards/tracks/oldschool";
import { TrifoldBoard } from "../../boards/tracks/trifold";
import { Back, Backs, CardBack } from "../card";
import { aroundTheBack } from "../../boards/tracks/aroundTheBack";

interface IPicker<T> {
    selected: T,
    onSelect: (item: T) => void,
}

export const Boards = [
    OldSchoolBoard,
    TrifoldBoard,
    aroundTheBack
];

const ChooseDeck: React.FC<IPicker<Back>> = props => {
    return <div style={{ flexDirection: "row", display: "flex", justifyContent: "center" }}>
        {Backs.map(back =>
            <div
                style={{ margin: 20, border: props.selected === back ? "10px solid lightblue" : "10px solid transparent" }}
                onClick={() => props.onSelect(back)}
            >
                <CardBack back={back} width={100} />
            </div>)}
    </div>
}

interface IBoardPicker extends IPicker<TrackDefinition> {
    players: number,
    points: number,
}

const ChooseBoard: React.FC<IBoardPicker> = props => {
    return <div style={{ flexDirection: "row", display: "flex", justifyContent: "center" }}>
        {Boards.map(board =>
            <div
                style={{
                    margin: 20,
                    border: props.selected === board ? "10px solid lightblue" : "10px solid transparent",
                    filter: board.players < props.players || board.pointsToEnd < props.points ? "grayscale(100%)" : undefined
                }}
                onClick={board.players < props.players || board.pointsToEnd < props.points ? undefined : () => props.onSelect(board)}
            >
                <Track track={board} height={300} />
            </div>)}
    </div>
}

export const CreateGame: GameComponent = props => {
    const [deck, setDeck] = React.useState<Back>("red");
    const [board, setBoard] = React.useState(TrifoldBoard);
    const [players, setPlayers] = React.useState(2);
    const [rules, setRules] = React.useState<"CribBIGage" | "cribbage">("CribBIGage");
    const [points, setPoints] = React.useState(120);

    return <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
        <img alt="CribBIGage!" src={logo} style={{ maxWidth: "70%", flex: "auto", maxHeight: "30%" }} />
        <h1>Create a game</h1>
        <Button
            onClick={() => {
                let mode = {} as GameRules;
                if (players === 2 && rules === "CribBIGage") {
                    mode = CribBIGage_2Hand
                }
                if (players === 3 && rules === "CribBIGage") {
                    mode = CribBIGage_3Hand
                }
                if (players === 2 && rules === "cribbage") {
                    mode = cribbage_2Hand
                }
                if (players === 3 && rules === "cribbage") {
                    mode = cribbage_3Hand
                }

                props.setGameState(
                    startGame([
                        { name: "You" },
                        { name: "AI 1" },
                        { name: "AI 2" }],
                        {
                            ...mode,
                            pointsToWin: points,
                            players
                        },
                        {
                            boardName: board.name,
                            deckName: deck
                        }
                    ),
                    false);
            }}
        >
            Start
            </Button>
        <br />
        <br />
        <label>
            Players:
            <select value={players} onChange={ev => { ev.persist(); setPlayers(parseInt(ev.target.value)) }}>
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
            </select>
        </label>
        <br />
        <br />
        <label>
            Game Mode:
            <select
                value={rules} onChange={ev => { ev.persist(); setRules(ev.target.value as any) }}>
                <option value="CribBIGage">CribBIGage (7 Card)</option>
                <option value="cribbage">cribbage</option>
            </select>
        </label>
        <br />
        <br />
        <label>
            Game Length:
            <select value={points} onChange={ev => { ev.persist(); setPoints(parseInt(ev.target.value)) }}>
                <option value={120}>120 points</option>
                <option value={60}>60 points</option>
            </select>
        </label>
        <br />

        <ChooseBoard
            points={points}
            players={players}
            selected={board}
            onSelect={setBoard}
        />
        <br />

        <ChooseDeck
            selected={deck}
            onSelect={setDeck}
        />
    </div>
}