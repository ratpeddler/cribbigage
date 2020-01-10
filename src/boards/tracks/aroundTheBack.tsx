import React from "react";
import { createStraightSegment, createSpacer, createTrack, create90Segment, create180Segment, createContent } from "../../components/track";

const straight = createStraightSegment(70, 50, 3);
const breaker = createContent(10, 0, props => {
    const { dot, dotScale, trackWidth, index } = props;
    const width = .5 * trackWidth;
    return <div key={index} style={{
        position: "absolute",
        zIndex: 5,
        bottom: dot.x,
        left: dot.y,
        //border: `1px solid white`,
        backgroundColor: "white",
        width,
        height: 1,
        //borderRadius: diameter * 3,
        //marginBottom: -.5 * diameter,
        marginLeft: -.5 * width,
    }}></div>
});

const verticalBreaker = createContent(10, 0, props => {
    const { dot, dotScale, trackWidth, index } = props;
    const width = .5 * trackWidth;
    return <div key={index} style={{
        position: "absolute",
        zIndex: 5,
        bottom: dot.x,
        left: dot.y,
        //border: `1px solid white`,
        backgroundColor: "white",
        width: 1,
        height: width,
        //borderRadius: diameter * 3,
        marginBottom: -.5 * width,
        //marginLeft: -.5 * width,
    }}></div>
});

export const aroundTheBack = createTrack("Around the Back 60", 60, 3, 3, [
    createStraightSegment(50, 50, 3, 3),
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    create90Segment(70, 50, 3),
    ...verticalBreaker,
    create90Segment(70, 50, 3),
    //downBreaker,
    straight,
    //downBreaker,
    straight,
    //downBreaker,
    straight,
    create180Segment(70, 50, 3),
    straight,
    straight,
    straight,
    createStraightSegment(35, 50, 1, 1),
], "darkwalnut");

export const aroundTheBack120 = createTrack("Around the Back 120", 120, 3, 3, [
    createStraightSegment(50, 50, 3, 3),
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    create90Segment(70, 50, 3),
    ...verticalBreaker,
    create90Segment(70, 50, 3),
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    create180Segment(75, 50, 3),
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    straight,
    ...breaker,
    createStraightSegment(35, 50, 1, 1),
], "hardwood");
