export const SERVER_PORT  = 6970;
export const WORLD_WIDTH  = 800;
export const WORLD_HEIGHT = 800;
export const SERVER_FPS   = 30;

function isNumber(arg: any): arg is number {
    return typeof(arg) === "number";
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
