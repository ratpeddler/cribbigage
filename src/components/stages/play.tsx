import React from "react";
import { GameComponent } from "../game";
import { Hand, KeepCard, HandAndScore, ExtractKeptCard } from "../hand";
import { Button } from "../button";
import { scorePlay, sumCards, canPlay, cantPlayAtAll, playAI } from "../../game/play";
import { IsYou } from "./chooseGameMode";

export const Play: GameComponent = props => {
    const [keepCard, setKeepCard] = React.useState<KeepCard>({});
    const disabled = Object.keys(keepCard).filter(c => !!keepCard[c as any]).length != 1;

    const { setGameState } = props;
    const { game } = props;

    const { players, previousPlayedCards = [], playedCards = [], cut } = game;

    const user = players.filter(IsYou)[0];

    // need to filter out the already played cards
    const userRemainingCards = user.hand.filter(c => playedCards.indexOf(c) < 0).filter(c => previousPlayedCards.indexOf(c) < 0);
    console.log("remaining user cards", userRemainingCards);
    const cantPlay = cantPlayAtAll(playedCards, userRemainingCards);

    React.useEffect(() => {
        console.log("checking if user should play")
        let nextToPlay = game.nextToPlay || 0;
        if (!IsYou(players[nextToPlay])) {
            console.log("user was NOT next, so having ai play");
            setGameState(playAI(game), false);
        }
        else {
            console.log("yep it was the users turn");
        }
    }, [game, game.nextToPlay, players, setGameState]);

    return <div>
        Play cards!

        <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
                Cut:
                <Hand cards={cut!} /></div>
            <div>
                Previous Played cards:
                {previousPlayedCards && <Hand cards={previousPlayedCards} keepCards={{}} stacked={true} />}
            </div>
        </div>

        Played cards:
        {playedCards && <Hand cards={playedCards} keepCards={{}} />}

        Your Hand:
        {players.map((p, index) => {
            const remainingCards = p.hand.filter(c => playedCards.indexOf(c) < 0).filter(c => previousPlayedCards.indexOf(c) < 0);
            return IsYou(p) && <HandAndScore
                cards={remainingCards}
                key={index}
                maxKeep={1}
                keepCards={keepCard}
                setKeepCards={newKeptCards => {
                    let card = ExtractKeptCard(newKeptCards);
                    if (card) {
                        // ENFORCE play rules
                        if (canPlay(playedCards, ExtractKeptCard(newKeptCards))) {
                            setKeepCard(newKeptCards);
                        }
                        else {
                            console.log("cant play that!");
                        }
                    }
                    else {
                        setKeepCard(newKeptCards);
                    }
                }}
            />
        })}

        Current count: {playedCards && sumCards(playedCards)}
        SCORE: {playedCards && Object.keys(keepCard).filter(c => !!keepCard[c as any]).length && scorePlay(playedCards!, ExtractKeptCard(keepCard))}

        <Button
            disabled={disabled}
            onClick={() => {
                let playedCard = ExtractKeptCard(keepCard);
                let newPlayedCards = [...playedCards];
                newPlayedCards.push(playedCard);

                // Add your score
                let score = scorePlay(playedCards, playedCard);
                const newPlayers = [...players];
                newPlayers.map(p => {
                    if (IsYou(p)) {
                        if (score > 0) {
                            p.lastScore = p.score;
                            p.score += score;
                        }
                    }

                    return p;
                })

                // TODO: Play the other player's card and add their scores

                // Reset the current selection
                setKeepCard({});

                console.log("playing a card. next to play is:", game.nextToPlay);
                // Update played cards
                setGameState(playAI({
                    ...game,
                    playedCards: newPlayedCards,
                    players: newPlayers,
                    lastToPlay: game.nextToPlay,
                    nextToPlay: (game.nextToPlay || 0) + 1
                }), false);

            }}>
            Play selected card
        </Button>

        <Button disabled={!cantPlay} onClick={() => {
            // TODO have the other person play if they can

            // Reset the current selection
            setKeepCard({});

            // Add the new played cards to the previously played stack
            let newPrevious = [...previousPlayedCards, ...playedCards];

            // Update played cards
            setGameState(playAI({
                ...game,
                previousPlayedCards: newPrevious,
                playedCards: [],
                nextToPlay: (game.nextToPlay || 0) + 1
            }), false);
        }}>
            Pass
        </Button>

        <Button onClick={() => props.setGameState({
            ...props.game,
            previousPlayedCards: [],
            playedCards: [],
            nextToPlay: 0,
            lastToPlay: undefined,
        }, true)}>
            SKIP to Score hands
        </Button>
    </div>;
}