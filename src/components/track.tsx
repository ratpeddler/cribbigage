import React from "react";
import { PlayerState } from "../game/players";
import { OldSchoolBoard } from "../boards/tracks/oldschool";
import { TrifoldBoard } from "../boards/tracks/trifold";
import { aroundTheBack } from "../boards/tracks/aroundTheBack";
import { SCurve } from "../boards/tracks/sCurve";

export interface TrackDefinition {
    name: string,
    background: BoardBackground,
    dots: Dot[],
    players: number,
    pointsToEnd: number,
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

    decorative?: boolean;
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

export function createTrack(name: string, pointsToEnd: number, startOffset: number, players: number, segments: SegmentDefinition[], background: BoardBackground = "sandybrown", horizontal?: boolean): TrackDefinition {
    let x = 0;
    let y = 0;
    let angle = horizontal ? (Math.PI / 2) : 0;
    let dots: Dot[] = [];
    let curIndex = 1 - startOffset;
    for (let segment of segments) {
        if (segment.dots.length > 0) {
            let lastMax = 0;
            dots.push(...segment.dots
                // Adjust the start offsets!
                .map(dot => {
                    lastMax = Math.max(lastMax, dot.pointIndex || 0);
                    const pointIndex = dot.pointIndex !== undefined ? dot.pointIndex + curIndex : undefined
                    return {
                        ...dot,
                        pointIndex
                    }
                })
                // rotate
                .map(dot => rotate(dot, angle))
                // translate
                .map(dot => translate(dot, x, y)));

            // Dont count decorative segments!
            curIndex += segment.decorative ? 0 : lastMax + 1;
        }

        let rotated = rotate(segment.length, angle);
        x += rotated.x;
        y += rotated.y;
        angle += segment.angle;
    }

    return {
        name,
        pointsToEnd,
        background,
        dots: dots.map((dot, i) => ({
            ...dot,
        })),
        startOffset,
        players
    };
}

export function createSpacer(length: number, angle: number = 0, content?: React.ReactNode): SegmentDefinition {
    return {
        decorative: true,
        length: { x: length, y: 0 },
        angle,
        dots: content ? [{x:0, y:0, fake: true, content}] : [],
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
    const {dot} = props;
    const {fake, playerPresentAndColor} = dot;
    let diameter = 1;
    if(playerPresentAndColor){
        diameter = 6;
    }
    const radius = diameter / 2;
    return <>
        {<div style={{
            position: "absolute",
            zIndex: playerPresentAndColor ? 10000: 10,
            bottom: dot.x,
            left: dot.y,
            border: fake ? undefined : `2px solid ${playerPresentAndColor || "transparent"}`, // + ([dot.fake ? "red" : "black"]),
            backgroundColor: fake ? undefined : playerPresentAndColor || "rgba(0,0,0,.75)",
            width: diameter,
            height: diameter,
            borderRadius: diameter * 3,
            marginBottom: -1 * radius,
            marginLeft: -1 * radius
        }}
            title={dot.pointIndex + "," + dot.playerIndex}
        >
            {dot.content}
        </div>}
    </>
}


export const Track: React.FC<{ track: TrackDefinition, height?: number, width?: number }> = props => {
    const { track, height, width } = props;
    let { dots, background } = track;
    let bounds = getTrackBounds(dots);
    //console.log("initial bounds " + track.name, bounds.min.x, bounds.min.y);

    // move all dots so they are positive
    dots = dots.map(dot => translate(dot, bounds.min.x * -1, bounds.min.y * -1));
    bounds = getTrackBounds(dots);
    //console.log("min bounds after making positive " + track.name, bounds.min.x, bounds.min.y);

    // TODO: factor in width as WELL
    if (height){
        const scaleFactor = height / bounds.max.x;
        dots = dots.map(dot => scale(dot, scaleFactor));
        bounds = getTrackBounds(dots);
    } 

    const image = getBackground(background);
    //console.log("goal height: " + height + ". max bounds after scaling down " + track.name, bounds.max.x, bounds.max.y);

    return <div
     style={{ 
         backgroundColor: image ? undefined : background, 
         backgroundImage: image && `url(${image})`,
            padding: 10,
           flex: "none", 
           display: "inline-block" ,
           boxShadow: "5px 5px 10px grey",
           }}>
        <div style={{ position: "relative", height: props.height || bounds.max.x, width: props.width || bounds.max.y, margin: 10, }}>
            {dots.map((dot, i) => <SimpleDot dot={dot} key={i + ":" + dot.pointIndex + "," + dot.playerIndex} />)}
        </div>
    </div>;
}

export const Boards = [
    OldSchoolBoard,
    TrifoldBoard,
    aroundTheBack,
    SCurve,
];

const pine = require("./../boards/textures/pine.jpg");
const hardwood = require("./../boards/textures/hardwood.jpg");
const oak = require("./../boards/textures/oak.jpg");
const walnut = require("./../boards/textures/walnut.jpg");
const darkwalnut = require("./../boards/textures/darkwalnut.jpg");

export type BoardBackground = "oak" | "pine" | "hardwood" | "walnut" | "darkwalnut" | "sandybrown";

function getBackground(bg: BoardBackground) {
    switch (bg) {
        case "walnut":
            return walnut;
        case "darkwalnut":
            return darkwalnut;
        case "oak":
            return oak;
        case "pine":
            return pine;
        case "hardwood":
            return hardwood;
    }

    return undefined;
}