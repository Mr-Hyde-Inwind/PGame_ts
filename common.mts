export const SERVER_PORT  = 6970;
export const WORLD_WIDTH  = 800;
export const WORLD_HEIGHT = 800;
export const SERVER_FPS   = 30;
export const PLAYER_SIZE  = 30;

function isNumber(arg: any): arg is number {
    return typeof(arg) === "number";
}

function isBoolean(arg: any): arg is number {
    return typeof(arg) === "boolean";
}

type Direction = 'up' | 'down' | 'left' | 'right';

type Moving =  {
    [key in Direction]: boolean;
}

const DEFAULT_MOVING: Moving = {
    'up':    false,
    'down':  false,
    'left':  false,
    'right': false,
}

function isDirection(arg: any): arg is Direction {
    return DEFAULT_MOVING[arg as Direction] !== undefined
}

export interface Player {
    id: number,
    x: number,
    y: number,
    moving: {
        [k in Direction]: boolean
    },
}

export interface StartMoving {
    kind:      "StartMoving",
    id:        number,
    start:     boolean,
    direction: Direction,
}

export function isStartMoving(arg: any): arg is StartMoving {
    return arg
        && arg.kind === "StartMoving"
        && isNumber(arg.id)
        && isBoolean(arg.start)
        && isDirection(arg.direction);
}

export interface Hello {
    kind: "Hello",
    id: number,
}

export function isHello(arg: any): arg is Hello {
    return arg
        && arg.kind === "Hello"
        && isNumber(arg.id);
}

export interface PlayerJoined {
    kind: "PlayerJoined",
    id: number,
    x: number,
    y: number,
}

export function isPlayerJoined(arg: any): arg is PlayerJoined {
    return arg
        && arg.kind === "PlayerJoined"
        && isNumber(arg.id)
        && isNumber(arg.x)
        && isNumber(arg.y);
}

export interface PlayerLeft {
    kind: "PlayerLeft",
    id: number,
}

export function isPlayerLeft(arg: any): arg is PlayerLeft {
    return arg
        && arg.kind === "PlayerLeft"
        && isNumber(arg.id);
}

export type Event = PlayerJoined | PlayerLeft;
