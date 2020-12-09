import { Actions, ChatUserstate, Client, ClientBase } from "tmi.js";
import { Job } from "./job";
import { getReactionByKeyword, Reaction } from "./keywords";

import { EventEmitter } from "events";
export class Chat {
  public client: ClientBase & Actions;
  public reactionValues: Map<Reaction, number>;

  private ee: EventEmitter = new EventEmitter();

  constructor(private channel: string, private job: Job) {
    this.reactionValues = new Map();

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
      (c: string, u: ChatUserstate, message: string, s: boolean) =>
        this.onMessage(message)
    );
  }

  /**
   * This method is executed when the Twitch IRC chat receives a message
   *
   * @param channel The channel in which the message was sent
   * @param message The message that was sent
   */
  private onMessage(message: string) {
    this.ee.emit("message", message);

    if (message == "!reset") {
      this.resetValues();
      return;
    }

    const reaction: Reaction = getReactionByKeyword(message);
    if (reaction == null) {
      return;
    }

    // increment counter
    console.log(reaction);
    const val: number = this.increment(reaction);

    // reaction was found
    console.log("  -> Reaction found:", reaction, val);

    // emit
    this.ee.emit("reaction", reaction, val);
    this.job.ping();
  }

  /**
   * Resets all stored reaction values
   *
   * @param channel The channel in which the value is to be reset.
   * Can be an array, a string, or remain empty.
   * If the parameter is left empty, the values of each channel are reset.
   */
  public resetValues(): void {
    this.reactionValues.clear();
    this.ee.emit("reset");
  }

  /**
   * Count up the reaction value in the specified channel by 1
   *
   * @param channel The channel in which the reaction should be increased
   * @param reaction The reaction to be counted up
   */
  public increment(reaction: Reaction): number {
    let value: number = this.reactionValues.has(reaction)
      ? this.reactionValues.get(reaction)
      : 0;

    // increment value
    value++;

    this.reactionValues.set(reaction, value);
    this.ee.emit("increment", reaction, value);

    return value;
  }

  public getValues(): number[] {
    const keys: number[] = [];
    const map: Map<number, number> = new Map();

    this.reactionValues.forEach((value: number, reaction: Reaction) => {
      map.set(reaction.sorting, value);
      keys.push(reaction.sorting);
    });
    
    // ToDo: Rework my shitty sorting
    // or even better: rework this whole method
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < keys.length; j++) {
        if (i == j) {
          continue;
        }

        const a = keys[i];
        const b = keys[j];

        if (a < b) {
          keys[i] = b;
          keys[j] = a;
        }
      }
    }

    const res: number[] = [];
    for (let i = 0; i < keys.length; i++) {
      res.push(map.get(keys[i]));
    }
    return res;
  }

  /**
   * Alias to {EventEmitter#on}
   *
   * @param event Event to listen for
   * @param listener Listener
   */
  public on(event: string | symbol, listener: (...args: any[]) => void): void {
    this.ee.on(event, listener);
  }
}
