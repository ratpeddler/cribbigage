import React from "react";
import { PlayerState } from "../game/players";

export const Path: React.FC<{ players: PlayerState[] }> = props => {

    return <>
        test
    </>;
}

interface Coord {
    x: number,
    y: number,
}

interface Dot extends Coord {
    fake?: boolean;

    pointIndex?: number;
    playerIndex?: number;
}

// Basic segment is always 5 dots
interface SegmentDefinition {
    /** Where the next track segment would start */
    length: Coord;

    /** The angle the next track segment would start at */
    angle: number;

    /** relative location of dots */
    dots: Dot[];
}

function translate(dot: Dot, x: number, y: number): Dot {
    return {
        ...dot,
        x: dot.x + x,
        y: dot.y + y,
    }
}


function rotate(dot: Dot, angle: number): Dot {
    return {
        ...dot,
        x: (dot.x * Math.cos(angle)) - (dot.y * Math.sin(angle)),
        y: (dot.x * Math.sin(angle)) + (dot.y * Math.cos(angle)),
    }
}

// Get a bounding box for the track
export function getTrackBounds(dots: Dot[]): { max: Coord, min: Coord } {
    let min = { x: 0, y: 0 };
    let max = { x: 0, y: 0 };

    dots.forEach(dot => {
        min.x = Math.min(dot.x, min.x);
        min.y = Math.min(dot.y, min.y);

        max.x = Math.max(dot.x, max.x);
        max.y = Math.max(dot.y, max.y);
    })

    return { min, max };
}

export function createTrack(segments: SegmentDefinition[]) {
    let x = 0;
    let y = 0;
    let angle = 0;
    let dots: Dot[] = [{ x: 0, y: 0, fake: true }];
    for (let segment of segments) {
        dots.push(...segment.dots
            // rotate
            .map(dot => rotate(dot, angle))
            // translate
            .map(dot => translate(dot, x, y)));

        let rotated = rotate(segment.length, angle);
        x += rotated.x;
        y += rotated.y;
        angle += segment.angle;

        // TODO actually do the angle
    }

    return dots;
}

export function createSpacer(length: number, angle: number = 0): SegmentDefinition {
    return {
        length: { x: length, y: 0 },
        angle,
        dots: [{ x: 0, y: 0, fake: true }]
    }
}

export function createStraightSegment(length: number, width: number, players: number, steps: number = 5): SegmentDefinition {
    let dots: Dot[] = [{ x: 0, y: 0, fake: true }];
    let interval = length / steps;
    let playeroffset = width / (players + 1);
    let initialPlayerOffset = width / -2;
    for (let i = 0; i < steps; i++) {
        // TODO players will change Y but not x
        for (let p = 1; p <= players; p++) {
            dots.push({ x: interval * (i + .5), y: initialPlayerOffset + (playeroffset * p) });
        }
    }

    return {
        length: { x: length, y: 0 },
        angle: 0,
        dots
    }
}

// This should eventually CURVE
export function create90Segment(length: number, width: number, players: number, left?: boolean): SegmentDefinition {
    let dots: Dot[] = [{ x: 0, y: 0, fake: true }];
    let angleOffset = (Math.PI) / 8;
    let interval = length / 5;
    let playeroffset = width / (players + 1);
    let initialPlayerOffset = width / -2;

    // create our dots on a line, then rotate based on the player offset and then shift to the right

    for (let i = 0; i < 5; i++) {
        let newDots: Dot[] = [];
        // each dot is on a line, and then we rotate it
        for (let p = 1; p <= players; p++) {
            newDots.push({ x: 0, y: -1 * length + .5 * interval + initialPlayerOffset + (playeroffset * p) });
        }

        // rotate dots based on the offset
        newDots = newDots.map(dot => rotate(dot, angleOffset * i))

        // translate them over 

        newDots = newDots.map(dot => translate(dot, .5 * interval, length - .5 * interval));

        if (left) {
            newDots = newDots.map(dot => ({ ...dot, y: -1 * dot.y }));
        }

        // TODO players will change Y but not x
        dots.push(...newDots);
    }


    return {
        length: { x: length, y: (left ? -1 : 1) * length },
        angle: (left ? -1 : 1) * Math.PI / 2,
        dots
    }
}

// This should eventually CURVE
export function create180Segment(length: number, width: number, players: number, left?: boolean): SegmentDefinition {
    let dots: Dot[] = [{ x: 0, y: 0, fake: true }];
    let angleOffset = (Math.PI) / 4;
    let interval = length / 5;

    // want players to be centered arround -.5 x length before rotation
    let playeroffset = width / (players + 1);
    let initialPlayerOffset = width / -2;

    // create our dots on a line, then rotate based on the player offset and then shift to the right

    for (let i = 0; i < 5; i++) {
        let newDots: Dot[] = [];
        // each dot is on a line, and then we rotate it // TODO handle player offset...
        for (let p = 1; p <= players; p++) {
            newDots.push({ x: 0, y: -.5 * length + initialPlayerOffset + (playeroffset * p) });
        }

        // rotate dots based on the offset
        newDots = newDots.map(dot => rotate(dot, angleOffset * i))

        // translate them over 

        newDots = newDots.map(dot => translate(dot, interval * .5, .5 * length));

        if (left) {
            newDots = newDots.map(dot => ({ ...dot, y: -1 * dot.y }));
        }

        // TODO players will change Y but not x
        dots.push(...newDots);
    }

    return {
        length: { x: 0, y: (left ? -1 : 1) * length },
        angle: (left ? -1 : 1) * Math.PI,
        dots
    }
}

export const SimpleDot: React.FC<{ dot: Dot }> = props => {
    return <>
        {!props.dot.fake && <div style={{ zIndex: 100, position: "absolute", bottom: props.dot.x, left: props.dot.y, border: "1px solid " + ([props.dot.fake ? "red" : "black"]), backgroundColor: "white", width: 10, height: 10, borderRadius: 10, marginBottom: -5, marginLeft: -5 }}></div>}
        <div style={{ position: "absolute", zIndex: 10000, bottom: props.dot.x, left: props.dot.y, border: "1px solid " + ([props.dot.fake ? "red" : "black"]), backgroundColor: props.dot.fake ? "grey" : "white", width: 5, height: 5, borderRadius: 10, marginBottom: -2.5, marginLeft: -2.5 }}></div>
    </>
}

export const Track: React.FC<{dots: Dot[]}> = props => {
    const {dots} = props;
    const {min, max} = getTrackBounds(dots);
    // scale and fit everything to fit!
    return <div style={{position: "relative", width: max.y, height: max.x, marginLeft: -2 * min.y}}>
        {dots.map(dot => <SimpleDot dot={dot} />)}
    </div>
}