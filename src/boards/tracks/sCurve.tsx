import React from "react";
import { createStraightSegment, createSpacer, createTrack, create90Segment, create180Segment } from "../../components/track";

const length = 70;
const width = 50;
const players = 3;
const straight = createStraightSegment(length, width, players);

export const SCurve = createTrack("S Curve", 120, 1, 3, [
    createStraightSegment(width, width, players, 1),
    straight,
    straight,
    create180Segment(length, width,players,true),
    straight,
    straight,
    create90Segment(length, width,players,true),
    create90Segment(length, width,players,true),

    createSpacer(10),
    straight,
    straight,
    createSpacer(10),
    
    // middle curve
    create90Segment(length, width,players,true),
    create90Segment(length, width,players),

    createSpacer(10),
    straight,
    straight,
    createSpacer(10),

    
    create90Segment(length, width,players),
    create90Segment(length, width,players),
    straight,
    straight,
    create180Segment(length, width,players),
    straight,
    straight,

    createStraightSegment(width, width, 1, 1),
], "walnut");