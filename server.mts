import * as ws from 'ws';
import * as common from './common.mjs'


interface PlayerWithWs extends common.Player{
    clientWs: ws.WebSocket,
}

const players = new Map<number, PlayerWithWs>
let idCounter = 0;
let eventQueue: Array<common.Event> = [];

const wss = new ws.WebSocketServer({
    port: common.SERVER_PORT,
});

function tick() {
    for (let event of eventQueue) {
        switch (event.kind) {
            case "PlayerJoined": {
                const player: PlayerWithWs|undefined = players.get(event.id);
                if (player === undefined) continue;
                player.clientWs.send(JSON.stringify({
                    kind: "Hello",
                    id: event.id,
                }));
                const eventString = JSON.stringify(event);
                players.forEach((otherPlayer) => {
                    player.clientWs.send(JSON.stringify({
                        kind: "PlayerJoined",
                        id: otherPlayer.id,
                        x: otherPlayer.x,
                        y: otherPlayer.y,
                    }));
                    if (otherPlayer.id !== player.id) {
                        otherPlayer.clientWs.send(eventString);
                    }
                });
            } break;
            case "PlayerLeft": {
                const eventString: string = JSON.stringify(event);
                players.forEach((player) => {player.clientWs.send(eventString)});
            } break;
            case "PlayerMoving": {
                const player = players.get(event.id);
                if (player === undefined) continue;
                player.moving[event.direction] = event.start;
                const eventString = JSON.stringify(event);
                players.forEach((player) => player.clientWs.send(eventString));
            } break;
        }
    }
    eventQueue.length = 0;
    players.forEach((player) => common.updatePlayer(player, 1/common.SERVER_FPS));
    setTimeout(tick, 1000/common.SERVER_FPS);
}

(async () => {
    wss.on("connection", (clientWs) => {
        const id = idCounter++;
        const x = Math.random() * common.WORLD_WIDTH;
        const y = Math.random() * common.WORLD_HEIGHT;
        let player = {
            clientWs,
            id,
            x,
            y,
            moving: {
                'up': false,
                'down': false,
                'left': false,
                'right': false,
            }
        };
        players.set(id, player);
        console.log(`Player ${id} connected`);
        eventQueue.push({
            kind: "PlayerJoined",
            id, x, y
        });

        clientWs.addEventListener("message", (event) => {
            const message = JSON.parse(event.data.toString());
            if (common.isStartMoving(message)) {
                eventQueue.push({
                    kind: "PlayerMoving",
                    id,
                    x: player.x,
                    y: player.y,
                    start: message.start,
                    direction: message.direction,
                });
            }
        });

        clientWs.on("close", () => {
            console.log(`Player ${id} disconnected`);
            eventQueue.push({
                kind: "PlayerLeft",
                id,
            });
            players.delete(id);
        });
    })
    setTimeout(tick ,1000/common.SERVER_FPS);
    console.log(`Listening to ws://localhost:${common.SERVER_PORT}`);
})()
