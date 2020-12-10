import { Chat } from "./chat";
import { Actions, ChatUserstate, Client, ClientBase } from "tmi.js";

export class TwitchChat extends Chat {
  /**
   * tmi.js client
   */
  public client: ClientBase & Actions;

  constructor(channel: string) {
    super(channel);

    // create client
    this.client = Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [this.channel],
    });

    // debug
    console.log("[Chat] Connecting to channel: " + channel);
    this.client.connect();
    console.log("[Chat] Connected!");

    // events
    this.client.on(
      "message",
      (c: string, u: ChatUserstate, message: string, s: boolean) => {
        this.emitMessage(u.username, message);
      }
    );
  }
}