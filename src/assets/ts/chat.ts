import { Actions, Client, ClientBase, Events } from "tmi.js";

const client: ClientBase & Actions = Client({
    connection: {
        secure: true,
        reconnect: true,
      },
      channels: ["freiheitstream"]
});

console.log("Connecting ...");
client.connect();
console.log("Connected!");