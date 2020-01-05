import React from "react";
import { createStraightSegment, createSpacer, createTrack, create90Segment, create180Segment } from "../../components/track";

const players = 3;
const length = 50;
const width = 50;

const straight = createStraightSegment(length, width, players);

const Normal = [ straight];
const Down = [ straight];
const Line = [
       // breaker,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
    ...Normal,
    createSpacer(5),
];
const DownLine = [
   // downBreaker,
    createSpacer(5),
    ...Down,
    createSpacer(5),
    ...Down,
    createSpacer(5),
    ...Down,
    createSpacer(5),
    ...Down,
    createSpacer(5),
    ...Down,
    createSpacer(5),
    ...Down,
    createSpacer(5),
    ...Down,
    createSpacer(5),
];

export const TrifoldBoard = createTrack("Trifold", 120, 1, 3, [
    createStraightSegment(15, 50, 3, 1),
    createSpacer(5),
    straight,
    ...Line,
    create180Segment(70, 50, 3),
    ...DownLine,
    create180Segment(70, 50, 3, true),
    ...Line,
    createStraightSegment(25, 50, 1, 1),
], "oak");

const QuadLine = [
    //breaker,
    //breaker,
...Normal,
...Normal,
...Normal,
...Normal,
...Normal,
...Normal,
];
const QuadDownLine = [
//downBreaker,
...Down,
...Down,
...Down,
...Down,
...Down,
...Down,
];
export const QuadfoldBoard = createTrack("Quadfold", 120, 1, 3, [
    createStraightSegment(15, 50, 3, 1),
    ...QuadLine,
    create180Segment(70, 50, 3),
    ...QuadDownLine,
    create180Segment(70, 50, 3, true),
    ...QuadLine,
    create180Segment(70, 50, 3),
    ...QuadDownLine,
    //breaker,
    createStraightSegment(25, 50, 1, 1),
], "oak");