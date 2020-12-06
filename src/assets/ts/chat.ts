import { Actions, ChatUserstate, Client, ClientBase } from "tmi.js";

export class Chat {
  public client: ClientBase & Actions;

  constructor(private channel: string) {
    // create client
    this.client = Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [this.channel],
    });

    // debug
    console.log("[Chat] Connecting to channel #" + channel);
    this.client.connect();
    console.log("[Chat] Connected!");

    // this.registerEvents();
  }

  private registerEvents() {
    this.client.on(
      "message",
      (
        channel: string,
        userstate: ChatUserstate,
        message: string,
        self: boolean
      ) => {
        console.log(channel, message);
      }
    );
  }
}
