import { Actions, ChatUserstate, Client, ClientBase } from "tmi.js";
import { Job } from "./job";
import { getReactionByKeyword, Reaction } from "./keywords";

import { EventEmitter } from "events";
export class Chat {
  public client: ClientBase & Actions;
  public reactionValues: Map<string, Map<Reaction, number>>;
  
  private ee: EventEmitter = new EventEmitter();

  constructor(private channels: string[], private job: Job) {
    this.reactionValues = new Map();

    // create client
    this.client = Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: this.channels,
    });

    // debug
    console.log("[Chat] Connecting to channels: " + channels);
    this.client.connect();
    console.log("[Chat] Connected!");

    // events
    this.client.on(
      "message",
      (
        channel: string,
        userstate: ChatUserstate,
        message: string,
        self: boolean
      ) => this.onMessage(channel, message)
    );
  }
  
  /**
   * This method is executed when the Twitch IRC chat receives a message
   *
   * @param channel The channel in which the message was sent
   * @param message The message that was sent
   */
  private onMessage(channel: string, message: string) {
    this.ee.emit("message", channel, message);

    if (message == "!reset") {
      this.resetValues();
      return;
    }

    const reaction: Reaction = getReactionByKeyword(message);
    if (reaction == null) {
      return;
    }

    // increment counter
    console.log(channel, reaction);
    const val: number = this.increment(channel, reaction);

    // reaction was found
    console.log("  -> Reaction found:", reaction, val);

    // emit
    this.ee.emit("reaction", channel, reaction, val);
    this.job.ping();
  }

  /**
   * Resets all stored reaction values
   *
   * @param channel The channel in which the value is to be reset.
   * Can be an array, a string, or remain empty.
   * If the parameter is left empty, the values of each channel are reset.
   */
  public resetValues(channel?: string | string[]): void {
    if (channel == null) {
      this.channels.forEach((val) => this.resetValues(val));
    } else if (channel instanceof Array) {
      for (let i: number = 0; i < channel.length; i++) {
        this.resetValues(channel[i]);
      }
    } else {
      console.log("Clearing channel:", channel);
      if (this.reactionValues.has(channel)) {
        this.reactionValues.get(channel).clear();
        this.ee.emit("reset", channel);
      }
    }
  }

  /**
   * Count up the reaction value in the specified channel by 1
   *
   * @param channel The channel in which the reaction should be increased
   * @param reaction The reaction to be counted up
   */
  public increment(channel: string, reaction: Reaction): number {
    if (!this.reactionValues.has(channel)) {
      this.reactionValues.set(channel, new Map());
    }
    const values = this.reactionValues.get(channel);

    let value: number = values.has(reaction) ? values.get(reaction) : 0;

    // increment value
    value++;

    values.set(reaction, value);
    this.ee.emit("increment", reaction, value);

    return value;
  }

  public on(event: string | symbol, listener: (...args: any[]) => void): void {
    this.ee.on(event, listener);
  }

}
