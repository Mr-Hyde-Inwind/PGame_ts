export const SERVER_PORT  = 6970;
export const WORLD_WIDTH  = 800;
export const WORLD_HEIGHT = 800;
export const SERVER_FPS   = 60;
export const PLAYER_SIZE  = 30;

const PLAYER_SPEED = 500;

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

export type Vector2 = {x: number, y: number};

export const DIRECTION_VECTORS: {[key in Direction]: Vector2} = {
    'up':    {x: 0, y: -1},
    'down':  {x: 0, y: 1},
    'left':  {x: -1, y: 0},
    'right': {x: 1, y: 0},
}

export function updatePlayer(player: Player, deltaTime: number) {
    let dir: Direction;
    let dx = 0;
    let dy = 0;
    for (dir in DIRECTION_VECTORS) {
        if (player.moving[dir]) {
            dx += DIRECTION_VECTORS[dir].x;
            dy += DIRECTION_VECTORS[dir].y;
        }
    }
    player.x = (player.x + dx*PLAYER_SPEED*deltaTime + WORLD_WIDTH) % WORLD_WIDTH;
    player.y = (player.y + dy*PLAYER_SPEED*deltaTime + WORLD_HEIGHT) % WORLD_HEIGHT;
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

export interface PlayerMoving {
    kind: "PlayerMoving",
    id: number,
    x: number,
    y: number,
    start: boolean,
    direction: Direction
}

export function isPlayerMoving(arg: any): arg is PlayerMoving {
    return arg
        && arg.kind === "PlayerMoving"
        && isNumber(arg.id)
        && isNumber(arg.x)
        && isNumber(arg.y)
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

export type Event = PlayerJoined | PlayerLeft | StartMoving | PlayerMoving;
