import * as common from './common.mjs'

(
    async () => {
        let myId: undefined|number = undefined
        const ws = new WebSocket(`ws://localhost:${common.SERVER_PORT}`);
        ws.addEventListener("close", (event) => {
            console.log("WEBSOCKET CLOSE", event);
        });
        ws.addEventListener("open", (event) => {
            console.log("WEBSOCKET OPEN", event);
        });
        ws.addEventListener("message", (event) => {
            if (myId === undefined) {
                const message = JSON.parse(event.data);
                if (common.isHello(message)) {
                    myId = message.id;
                    console.log(`Connected as player ${myId}`);
                } else {
                    console.log("Received bogus-amogus message from server", message);
                    ws.close();
                }
            } else {

            }
        });
        ws.addEventListener("error", (event) => {
            console.log("WEBSOCKET ERROR", event);
        });
    }
)()
