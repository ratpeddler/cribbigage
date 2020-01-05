import React from "react";
import { createStraightSegment, createSpacer, createTrack, create90Segment, create180Segment, createContent, ColorDot, SimpleDot } from "../../components/track";

const length = 70;
const width = 50;
const players = 3;
const straight = createStraightSegment(length, width, players);
const long = createStraightSegment(100, width, players);
const backer = createContent(20, 0, props => {
    return <ColorDot {...props} dotScale={props.dotScale * .25} color="tan" />
});

export const SCurve = createTrack("S Curve", 120, 1, 3, [
    createStraightSegment(width * .5, width, players, 1),
    ...backer,
    long,
    ...backer,
    long,
    ...backer,
    create180Segment(length + 10, width,players,true),
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    create90Segment(length, width,players,true),
    ...backer,
    create90Segment(length, width,players,true),
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    ...backer,    
    // middle curve
    create90Segment(length, width,players,true),
    ...backer,
    create90Segment(length, width,players),
    ...backer,
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,

    
    create90Segment(length, width,players),
    ...backer,
    create90Segment(length, width,players),
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    straight,
    ...backer,
    create180Segment(length + 10, width,players),
    ...backer,
    long,
    ...backer,
    long,
    ...backer,
    createStraightSegment(width * .5, width, 1, 1),
], "walnut");