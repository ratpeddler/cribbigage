import React from "react";
import { createStraightSegment, createSpacer, createTrack, create90Segment, create180Segment } from "../../components/track";

const straight = createStraightSegment(70, 50, 3);
const breaker = createSpacer(10, 0, <div style={{width: 40, height: 0, border: "1px solid white", marginTop: -6, marginLeft: -18}}></div>);
const downBreaker = createSpacer(10, 0, <div style={{width: 40, height: 0, border: "1px solid white", marginTop: 6, marginLeft: -18}}></div>);
const verticalBreaker = createSpacer(10, 0, <div style={{width: 0, height: 40, border: "1px solid white", marginTop: -18, marginLeft: 6}}></div>);

export const aroundTheBack = createTrack(3, 3, [
    createStraightSegment(50, 50, 3, 3),
    breaker,
    straight,
    breaker,
    straight,
    breaker,
    straight,
    breaker,
    create90Segment(70, 50, 3),
    verticalBreaker,
    create90Segment(70, 50, 3),
    downBreaker,
    straight,
    downBreaker,
    straight,
    downBreaker,
    straight,
    downBreaker,
    create180Segment(70, 50, 3),
    breaker,
    straight,
    breaker,
    straight,
    breaker,
    straight,
    breaker,
    createStraightSegment(35, 50, 1, 1),
], "oak");