import * as ws from 'ws';
import * as common from './common.mjs'


interface Player {
    id: number,
    x: number,
    y: number,
}

const players = new Map<ws.WebSocket, Player>
let idCounter = 0;

const wss = new ws.WebSocketServer({
    port: common.SERVER_PORT,
});

(
    async () => {
        wss.on("connection", (clientWs) => {
            const id = idCounter++;
            const player = {
                id,
                x: Math.random() * common.WORLD_WIDTH,
                y: Math.random() * common.WORLD_HEIGHT,
            }
            players.set(clientWs, player);
            console.log("Someone connected.");
        })
    }
)()
