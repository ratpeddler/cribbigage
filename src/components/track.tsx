import React from "react";
import { PlayerState } from "../game/players";

export const Path: React.FC<{ players: PlayerState[] }> = props => {

    return <>
        test
    </>;
}

export interface TrackDefinition {
    track: Dot[],
    players: number,
    startOffset: number, // this is for the starting area and it's length
}

interface Coord {
    x: number,
    y: number,
}

interface Dot extends Coord {
    fake?: boolean;

    pointIndex?: number;
    playerIndex?: number;

    content?: React.ReactNode;
    playerPresentAndColor?: string;
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

export function translate(dot: Dot, x: number, y: number): Dot {
    return {
        ...dot,
        x: dot.x + x,
        y: dot.y + y,
    }
}


export function rotate(dot: Dot, angle: number): Dot {
    return {
        ...dot,
        x: (dot.x * Math.cos(angle)) - (dot.y * Math.sin(angle)),
        y: (dot.x * Math.sin(angle)) + (dot.y * Math.cos(angle)),
    }
}

export function scale(dot: Dot, scale: number, scaleY?: number): Dot {
    return {
        ...dot,
        x: dot.x * scale,
        y: dot.y * (scaleY === undefined ? scale : scaleY),
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

export function createTrack(startOffset: number, players: number, segments: SegmentDefinition[], horizontal?: boolean): TrackDefinition {
    let x = 0;
    let y = 0;
    let angle = horizontal ? (Math.PI / 2) : 0;
    let dots: Dot[] = [];
    let curIndex = 1 - startOffset;
    for (let segment of segments) {
        if(segment.dots.length > 0){
            let lastMax = 0;
            dots.push(...segment.dots
                // Adjust the start offsets!
                .map(dot => {
                    lastMax = Math.max(lastMax, dot.pointIndex || 0);
                    const pointIndex = dot.pointIndex !== undefined ? dot.pointIndex + curIndex : undefined
                    console.log("adding dot with point index: ", pointIndex, dot.playerIndex)
                    return {
                        ...dot,
                        pointIndex
                    }
                })
                // rotate
                .map(dot => rotate(dot, angle))
                // translate
                .map(dot => translate(dot, x, y)));
    
            curIndex += lastMax + 1;
        }
        
        let rotated = rotate(segment.length, angle);
        x += rotated.x;
        y += rotated.y;
        angle += segment.angle;
    }

    return {
        track: dots.map((dot, i) => ({
            ...dot,
        })),
        startOffset,
        players
    };
}

export function createSpacer(length: number, angle: number = 0, content?: React.ReactNode): SegmentDefinition {
    return {
        length: { x: length, y: 0 },
        angle,
        dots: content ? [] : [],
    }
}

export function createStraightLine(count: number, length: number, width: number, players: number) {
    let result: SegmentDefinition[] = [];
    for (let i = 0; i < count; i++) {
        result.push(createStraightSegment(length, width, players));
    }
    return result;
}

export function createStraightSegment(length: number, width: number, players: number, steps: number = 5): SegmentDefinition {
    let dots: Dot[] = [];
    let interval = length / steps;
    let playeroffset = width / (players + 1);
    let initialPlayerOffset = width / -2;
    for (let i = 0; i < steps; i++) {
        // TODO players will change Y but not x
        for (let p = 1; p <= players; p++) {
            dots.push({
                x: interval * (i + .5),
                y: initialPlayerOffset + (playeroffset * p),
                playerIndex: p - 1,
                pointIndex: i,
            } as Dot);
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
    let dots: Dot[] = [];
    let angleOffset = (Math.PI) / 8;
    let interval = length / 5;
    let playeroffset = width / (players + 1);
    let initialPlayerOffset = width / -2;

    // create our dots on a line, then rotate based on the player offset and then shift to the right

    for (let i = 0; i < 5; i++) {
        let newDots: Dot[] = [];
        // each dot is on a line, and then we rotate it
        for (let p = 1; p <= players; p++) {
            newDots.push({
                x: 0,
                y: -1 * length + .5 * interval + initialPlayerOffset + (playeroffset * p),
                playerIndex: p - 1,
                pointIndex: i,
            });
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
    let dots: Dot[] = [];
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
            newDots.push({
                x: 0,
                y: -.5 * length + initialPlayerOffset + (playeroffset * p),
                playerIndex: p - 1,
                pointIndex: i,
            });
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
    const diameter = 3;
    const radius = diameter / 2;
    if(props.dot.playerPresentAndColor){
        console.log("had player color", props.dot.playerPresentAndColor);
    }
    return <>
        {!props.dot.fake && false &&
            <div style={{ zIndex: 100, position: "absolute", bottom: props.dot.x, left: props.dot.y, border: "1px solid " + ([props.dot.fake ? "red" : "black"]), backgroundColor: "white", width: 10, height: 10, borderRadius: 10, marginBottom: -5, marginLeft: -5 }}></div>}
        {<div style={{
            position: "absolute",
            zIndex: 10000,
            bottom: props.dot.x,
            left: props.dot.y,
            border: `2px solid ${props.dot.playerPresentAndColor || "transparent"}`, // + ([props.dot.fake ? "red" : "black"]),
            backgroundColor: props.dot.playerPresentAndColor || "rgba(0,0,0,.80)",
            width: diameter,
            height: diameter,
            borderRadius: diameter,
            marginBottom: -1 * radius,
            marginLeft: -1 * radius
        }}
            title={props.dot.pointIndex +","+props.dot.playerIndex}
        >
            {props.dot.content}
        </div>}
    </>
}

const pine = require("./../boards/textures/pine.jpg");

export const Track: React.FC<{ dots: Dot[], height?: number, width?: number }> = props => {
    let { dots } = props;
    const { min, max } = getTrackBounds(dots);
    let newMax = translate(max, -1 * min.x, -1 * min.y);

    // move all dots so they are positive
    dots = dots.map(dot => translate(dot, min.x * -1, min.y * -1));

    // scale to percents
    if (props.height) dots = dots.map(dot => scale(dot, 100 / (newMax.x), 100 / (newMax.y)));

    return <div style={{ backgroundImage: `url(${pine})`, padding: 10, flex: "none", display: "inline-block" }}>
        <div style={{ position: "relative", height: props.height || newMax.x, width: props.width || newMax.y, margin: 10, }}>
            {dots.map((dot, i) => <SimpleDot dot={dot} key={i + ":" + dot.pointIndex + "," + dot.playerIndex} />)}
        </div>
    </div>;
}