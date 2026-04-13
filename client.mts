import * as common from './common.mjs'

(
    async () => {
        const ws = new WebSocket(`ws://localhost:${common.SERVER_PORT}`);
        ws.addEventListener("close", (event) => {
            console.log("WEBSOCKET CLOSE", event);
        });
        ws.addEventListener("open", (event) => {
            console.log("WEBSOCKET OPEN", event);
        });
        ws.addEventListener("message", (event) => {
            console.log("WEBSOCKET MESSAGE", event);
        });
        ws.addEventListener("error", (event) => {
            console.log("WEBSOCKET ERROR", event);
        });
    }
)()
