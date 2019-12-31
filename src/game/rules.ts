export interface GameRules {
    name: string;
    players: number;
    dealSize: number;
    keepSize: number;
    dealerExtra: number;
    cribExtra: number;
    cutSize: number;
    pointsToWin: number
}

function createGame(name: string, players: number, dealSize: number, keepSize: number, dealerExtra = 0, cribExtra = 0, cutSize = 1, pointsToWin = 120): GameRules {
    // Sanity check the rules

    // Crib should be same size as regular hand
    const totalDealt = players * dealSize + dealerExtra + cribExtra;
    const keptInHand = players * keepSize;
    const cribSize = totalDealt - keptInHand;

    if (cribSize != keepSize) {
        throw `${name}: Crib size should really be the same size as a normal hand! Crib was ${cribSize} hands were ${keepSize}`;
    }

    return {
        name,
        players,
        dealSize,
        keepSize,
        dealerExtra,
        cribExtra,
        cutSize,
        pointsToWin
    }
}

export const GameModes: GameRules[] = [
    createGame("2 Player CribBIGage", 2, 7, 5, 1),
    createGame("3 Player CribBIGage", 3, 6, 5, 1, 1),
    createGame("2 Player regular cribbage", 2, 6, 4),
    createGame("3 Player regular cribbage", 3, 5, 4, 1),
];