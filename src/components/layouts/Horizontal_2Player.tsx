import React from "react";
import { GameState } from "../../game/game";
import { ScoreBoard } from "../scoreboard";
import { getCurrentDealer, getPlayableHand, sumCards } from "../../game/play";
import { IsYou } from "../stages/chooseGameMode";
import { DeckAndCut } from "../deckAndCut";
import { Hand, HandAndScore } from "../hand";

export type SelectedCards = { [card: number]: boolean };
export interface LayoutProps {
    game: GameState,
    userActions?: () => React.ReactNode,
    selectedCards?: SelectedCards,
    setSelectedCards?: (newValue: SelectedCards) => void,
    maxSelectedCards?: number,
}

// This layout is designed for 2 players with the board on the side optimised for desktops (Landscape)
// Opponent is always TOP, the user is always BOTTOM
export const Horizontal2PlayerLayout: React.FC<LayoutProps> = props => {
    const { game, selectedCards, setSelectedCards, maxSelectedCards } = props;
    const { players } = game;

    if (players.length !== 2) { throw "2 player only layout!" }

    const opponent = players.filter(p => !IsYou(p))[0];
    const user = players.filter(IsYou)[0];
    const dealer = getCurrentDealer(game);
    const yourCrib = user === dealer;

    const opponentHand = getPlayableHand(opponent, game);
    const userHand = getPlayableHand(user, game);

    return <Row fill>
        {/* LEFT Board and Deck area */}
        <Column justified border="1px solid lightgrey">
            {/* Deck should be on the side of the dealer (TOP: Opponent, BOTTOM: You) */}
            {!yourCrib && <DeckAndCut />}
            <Row justified>
                <ScoreBoard vertical players={players} pointsToWin={game.rules.pointsToWin} lines={4} />
            </Row>
            {yourCrib && <DeckAndCut />}
        </Column>

        {/* RIGHT Hand and play area (From to: Op hand, Op played, SCORE, Your played, Your Hand) */}
        <Column fill>
            <Row justified>
                <Hand cards={opponentHand.map(c => -1)} stacked />
            </Row>
            <Row justified>
                {opponent.playedCards && <Hand cards={opponent.playedCards} />}
            </Row>
            <Column fill justified centered>
                {game.stage == "Play" && <h3>Current count: {sumCards(game.playedCards || [])}</h3>}
                {props.userActions?.()}
            </Column>
            <Row justified>
                {user.playedCards && <Hand cards={user.playedCards} />}
            </Row>
            {userHand && userHand.length > 0 && <Row justified fill alignStart>
                <HandAndScore cards={userHand} keepCards={selectedCards} setKeepCards={setSelectedCards} maxKeep={maxSelectedCards} />
            </Row>}
        </Column>

    </Row>
}

interface FlexProps {
    fill?: boolean;
    justified?: boolean;
    centered?: boolean;
    alignStart?: boolean;
    border?: string;
}

export const Column: React.FC<FlexProps> = props => {
    return <div style={{ flexDirection: "column", ...styles(props) }}>{props.children}</div>
}

export const Row: React.FC<FlexProps> = props => {
    return <div style={{ flexDirection: "row", ...styles(props) }}>{props.children}</div>
}

export const Fill: React.FC<FlexProps> = props => {
    return <div style={{ flex: "auto" }}>{props.children}</div>
}

function styles(props: FlexProps) {
    return {
        display: "flex",
        flex: flex(props),
        justifyContent: justifyContent(props),
        alignItems: alignItems(props),
        border: props.border,
    };
}

function flex(props: FlexProps) {
    return props.fill ? "auto" : undefined;
}

function justifyContent(props: FlexProps) {
    return props.justified ? "center" : undefined;
}

function alignItems(props: FlexProps) {
    return props.centered ? "center" : (props.alignStart ? "flex-start" : undefined);
}