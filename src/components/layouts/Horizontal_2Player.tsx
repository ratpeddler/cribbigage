import React from "react";
import { GameState } from "../../game/game";
import { ScoreBoard } from "../scoreboard";
import { getCurrentDealer, getPlayableHand, sumCards, ensureNextPlayer, getCurrentPlayer } from "../../game/play";
import { IsYou } from "../stages/chooseGameMode";
import { DeckAndCut } from "../deckAndCut";
import { Hand, HandAndScore } from "../hand";
import { ScoreIcon } from "../scoreIcon";
import { HandScore } from "../handScore";

export type SelectedCards = { [card: number]: boolean };
export interface LayoutProps {
    game: GameState,
    userActions?: () => React.ReactNode,
    selectedCards?: SelectedCards,
    setSelectedCards?: (newValue: SelectedCards) => void,
    maxSelectedCards?: number,
    onReorderHand?: (newHand: number[]) => void,
}

// This layout is designed for 2 players with the board on the side optimised for desktops (Landscape)
// Opponent is always TOP, the user is always BOTTOM
export const Horizontal2PlayerLayout: React.FC<LayoutProps> = props => {
    const { game, selectedCards, setSelectedCards, maxSelectedCards, onReorderHand } = props;
    const { players, playedCards = [] } = game;

    if (players.length > 3) { throw "2-3 player only layout for now!" }

    // Opponent properties
    const opponents = players.filter(p => !IsYou(p));
    const opponent1 = opponents[0];
    const opponent2 = opponents.length > 1 ? opponents[1] : undefined;

    // Opponent hands
    const opponent1Hand = getPlayableHand(opponent1, game).map(c => game.stage == "Score" ? c : -1);
    const opponent2Hand = opponent2 && getPlayableHand(opponent2, game).map(c => game.stage == "Score" ? c : -1);

    // TODO: Fix previously played cards....
    const opponent1PreviousPlayed = opponent1.hand.filter(c => playedCards.includes(c) && !opponent1.playedCards?.includes(c));
    const opponent2PreviousPlayed = opponent2 && opponent2.hand.filter(c => playedCards.includes(c) && !opponent2.playedCards?.includes(c));

    // User properties
    const user = players.filter(IsYou)[0];
    const userHand = getPlayableHand(user, game);
    const userPreviouslyPlayed = user.hand.filter(c => playedCards.includes(c) && !user.playedCards?.includes(c))
    const dealer = getCurrentDealer(game);
    const yourCrib = user === dealer;
    const isYourTurn = IsYou(getCurrentPlayer(game));

    // Stage specifics
    const currentCount = game.stage == "Play" ? sumCards(game.playedCards || []) : undefined;
    const cutGame = game.stage !== "Throw" && game.stage !== "Deal" ? game : undefined;

    return <Row fill>
        {/* LEFT Board and Deck area */}
        <Column justified border="1px solid lightgrey">
            {/* Deck should be on the side of the dealer (TOP: Opponent, BOTTOM: You) */}
            {!yourCrib && <DeckAndCut game={cutGame} />}
            <Row justified>
                <ScoreBoard vertical players={players} pointsToWin={game.rules.pointsToWin} lines={4} />
            </Row>
            {yourCrib && <DeckAndCut />}
        </Column>

        {/* RIGHT Hand and play area (From to: Op hand, Op played, SCORE, Your played, Your Hand) */}
        <Column fill>
            {/* Opposite opponent hand area (this could fit 1-2 hands and played cards probably.) */}
            <Row spaceBetween={!!opponent2} justified={!opponent2}>
                {opponent1 && <Row padding={10}>
                    <h3 style={{ color: opponent1.color }}>
                        {opponent1.name}
                        {dealer == opponent1 && <div>Dealer</div>}
                    </h3>
                    {/* Opponent 1 */}
                    {opponent1Hand.length > 0 && <HandAndScore cards={opponent1Hand} stacked cut={game.stage == "Score" ? game.cut : undefined} showScore={game.stage == "Score"} />}
                    {opponent1PreviousPlayed.length > 0 && <Hand cards={opponent1PreviousPlayed} stacked />}
                    {opponent1.playedCards && opponent1.playedCards.length > 0 && <Hand cards={opponent1.playedCards} stacked />}
                    {opponent1Hand && game.stage == "Score" && <HandScore hand={opponent1Hand} cut={props.game.cut} />}
                    <ScoreIcon player={opponent1} />
                </Row>}

                {opponent2 && <Row padding={10}>
                    {/* Opponent 2 */}
                    <ScoreIcon player={opponent2} />
                    {opponent2Hand && game.stage == "Score" && <HandScore hand={opponent2Hand} cut={props.game.cut} />}
                    {opponent2.playedCards && opponent2.playedCards.length > 0 && <Hand cards={opponent2.playedCards} stacked />}
                    {opponent2PreviousPlayed && opponent2PreviousPlayed.length > 0 && <Hand cards={opponent2PreviousPlayed} stacked />}
                    {opponent2Hand && opponent2Hand.length > 0 && <Hand cards={opponent2Hand} stacked />}
                    <h3 style={{ color: opponent2.color }}>
                        {opponent2.name}
                        {dealer == opponent2 && <div>Dealer</div>}
                    </h3>
                </Row>}

            </Row>

            {user.playedCards && user.playedCards.length > 0 &&
                <Row justified>
                    <Hand cards={user.playedCards} />
                    <ScoreIcon player={user} />
                </Row>}

            <Column fill justified centered>
                {currentCount !== undefined && <h3>Current count: {sumCards(game.playedCards || [])}</h3>}
                {props.userActions?.()}
            </Column>

            {userHand && userHand.length > 0 &&
                <Row justified fill alignStart>
                     <h3 style={{ color: user.color }}>
                        You
                        {IsYou(dealer) && <div>Dealer</div>}
                    </h3>
                    <HandAndScore
                        allDisabled={game.stage != "Throw" && !isYourTurn}
                        cards={userHand}
                        keepCards={selectedCards}
                        setKeepCards={setSelectedCards}
                        maxKeep={maxSelectedCards}
                        currentCount={currentCount}
                        onReorder={onReorderHand}
                    />
                    {userHand && game.stage == "Score" && <HandScore hand={userHand} cut={props.game.cut} />}
                </Row>}
        </Column>

    </Row>
}

interface FlexProps {
    padding?: number;
    fill?: boolean;
    justified?: boolean;
    spaceBetween?: boolean;
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
        padding: props.padding,
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
    return props.justified ? "center" : (props.spaceBetween ? "space-between" : undefined);
}

function alignItems(props: FlexProps) {
    return props.centered ? "center" : (props.alignStart ? "flex-start" : undefined);
}