import * as ws from 'ws';
import * as common from './common.mjs'


interface Player {
    clientWs: ws.WebSocket,
    id: number,
    x: number,
    y: number,
}

const players = new Map<number, Player>
let idCounter = 0;
let eventQueue: Array<common.PlayerJoined> = [];

const wss = new ws.WebSocketServer({
    port: common.SERVER_PORT,
});

function tick() {
    for (let event of eventQueue) {
        switch (event.kind) {
            case "PlayerJoined": {
                const player: Player|undefined = players.get(event.id);
                if (player === undefined) continue;
                player.clientWs.send(JSON.stringify({
                    kind: "Hello",
                    id: event.id,
                }));
                const eventString = JSON.stringify(event);
                players.forEach((otherPlayer) => {
                    if (otherPlayer.id !== player.id) {
                        player.clientWs.send(JSON.stringify({
                            kind: "PlayerJoined",
                            id: otherPlayer.id,
                            x: otherPlayer.x,
                            y: otherPlayer.y,
                        }));
                    }
                    if (otherPlayer.id !== player.id) {
                        otherPlayer.clientWs.send(eventString);
                    }
                });
            } break;
        }
    }
    eventQueue.length = 0;
    setTimeout(tick, 1000/common.SERVER_FPS);
}

(async () => {
    wss.on("connection", (clientWs) => {
        const id = idCounter++;
        const x = Math.random() * common.WORLD_WIDTH;
        const y = Math.random() * common.WORLD_HEIGHT;
        const player = {clientWs, id, x, y};
        players.set(id, player);
        console.log(`Player ${id} connected`);
        eventQueue.push({
            kind: "PlayerJoined",
            id, x, y
        });

        clientWs.on("close", () => {
            console.log(`Player ${id} disconnected`);
            players.delete(id);
        });
    })
    setTimeout(tick ,1000/common.SERVER_FPS);
    console.log(`Listening to ws://localhost:${common.SERVER_PORT}`);
})()
