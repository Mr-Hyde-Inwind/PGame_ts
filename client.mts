import * as common from './common.mjs'

(
    async () => {
        console.log(`SERVER FPS: ${common.SERVER_FPS}`);
        const canvas = document.getElementById('game') as HTMLCanvasElement|null
        if (canvas === null) throw new Error("no element with id `game`");
        canvas.height = common.WORLD_HEIGHT;
        canvas.width = common.WORLD_WIDTH;

        const ctx = canvas.getContext("2d");
        if (ctx === null) throw new Error("2d context not supported");

        const players = new Map<number, common.Player>();
        let myId: undefined|number = undefined
        const ws = new WebSocket(`ws://localhost:${common.SERVER_PORT}`);

        window.addEventListener("keydown", (event) => {
            let sendingEvent: common.StartMoving;
            if (myId === undefined) {
                console.log('Error: Trying to send moving instruction to server without id');
                return;
            }
            if (!event.repeat) {
                switch(event.code) {
                    case "KeyW":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     true,
                            direction: "up",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyS":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     true,
                            direction: "down",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyA":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     true,
                            direction: "left",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyD":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     true,
                            direction: "right",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                }
            }
            event.stopPropagation();
        });

        window.addEventListener("keyup", (event) => {
            let sendingEvent: common.StartMoving;
            if (myId === undefined) {
                console.log('Error: Trying to send moving instruction to server without id');
                return;
            }
            if (!event.repeat) {
                switch(event.code) {
                    case "KeyW":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     false,
                            direction: "up",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyD":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     false,
                            direction: "right",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyS":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     false,
                            direction: "down",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyA":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     false,
                            direction: "left",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                    case "KeyD":
                        sendingEvent = {
                            kind:      "StartMoving",
                            id:        myId,
                            start:     true,
                            direction: "right",
                        }
                        ws.send(JSON.stringify(sendingEvent));
                        break;
                }
            }
            event.stopPropagation();
        });
        ws.addEventListener("close", (event) => {
            console.log("WEBSOCKET CLOSE", event);
        });
        ws.addEventListener("open", (event) => {
            console.log("WEBSOCKET OPEN", event);
        });
        ws.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            if (myId === undefined) {
                if (common.isHello(message)) {
                    myId = message.id;
                    console.log(`Connected as player ${myId}`);
                } else {
                    console.log("Received bogus-amogus message from server", message);
                    ws.close();
                }
            } else {
                if (common.isPlayerJoined(message)) {
                    players.set(message.id, {
                        id: message.id,
                        x:  message.x,
                        y:  message.y,
                        moving: {
                            'up': false,
                            'down': false,
                            'left': false,
                            'right': false,
                        }
                    });
                } else if (common.isPlayerLeft(message)) {
                    players.delete(message.id);
                } else if (common.isPlayerMoving(message)) {
                    const player = players.get(message.id);
                    if (player === undefined) {
                        console.log(`Received bogus-amogus message from server`, message);
                        ws.close();
                        return;
                    }
                    player.moving[message.direction] = message.start;
                    player.x = message.x;
                    player.y = message.y;
                } else {
                    console.log("Received bogus-amogus message from server", message);
                    ws.close();
                }
            }
        });
        ws.addEventListener("error", (event) => {
            console.log("WEBSOCKET ERROR", event);
        });

        let previousTime: number = 0;
        const frame = (timestamp: number) => {
            const deltaTime: number = (timestamp - previousTime)/1000;
            previousTime = timestamp;

            players.forEach((player) => common.updatePlayer(player, deltaTime));

            ctx.fillStyle = "gray";
            ctx.fillRect(0, 0, common.WORLD_WIDTH, common.WORLD_HEIGHT);
            for (const [_, player] of players) {
                if (player.id === myId) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(player.x - common.PLAYER_SIZE/2 - 3, player.y - common.PLAYER_SIZE/2 - 3, common.PLAYER_SIZE+6, common.PLAYER_SIZE+6);
                }
                ctx.fillStyle = "red";
                ctx.fillRect(player.x - common.PLAYER_SIZE/2, player.y - common.PLAYER_SIZE/2, common.PLAYER_SIZE, common.PLAYER_SIZE);
            }

            window.requestAnimationFrame(frame);
        };
        window.requestAnimationFrame(frame);
    }
)()
