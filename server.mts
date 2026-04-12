import * as ws from 'ws';

const SERVER_PORT = 6070;

const wss = new ws.WebSocketServer({
    port: SERVER_PORT,
});

(
    async () => {
        wss.on("connection", (clientWs) => {
            console.log("Someone connected.");
        })
    }
)()
