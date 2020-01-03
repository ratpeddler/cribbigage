import { createTrack, createStraightSegment, createStraightLine, createSpacer } from "../../components/track";

const length = 100;
const players = 2;
const width = 100;
const rightTurn = createSpacer(0, Math.PI / 2);
const leftTurn = createSpacer(0, Math.PI / -2);
const stepSize = .25 * width;
const stepBack = createSpacer(-1 * stepSize);
const stepForward = createSpacer(stepSize);

const side = createStraightLine(6, length, width, players);

const middleSegment = createStraightSegment(width, width, players, 1);
const joint = [
    stepBack,
    rightTurn,
    middleSegment,
    rightTurn,
    stepBack,
]

const onceAround = [
    ...side,
    ...joint,
    ...side,
    ...joint,
];

const startArea = [
    stepForward,
    leftTurn,
    stepBack,
    middleSegment,
    rightTurn,
    stepBack,
]

export const OldSchool = createTrack(1, 2, [
    ...startArea,
    ...onceAround,
    ...onceAround,
])