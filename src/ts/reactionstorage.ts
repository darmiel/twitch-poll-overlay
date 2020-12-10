import { EventEmitter } from "events";
import { Chart } from "./charts/chart";
import { Chat } from "./chats/chat";
import { Job } from "./job";
import { getReactionByKeyword, Reaction, reactions } from "./keywords";

export enum UpdateMode {
  INCREMENT = 1,
  DECREMENT = -1,
}

export class ReactionStorage extends EventEmitter {
  public duplicationChecking: boolean = true;

  private clients: Map<string, Reaction> = new Map();
  private reactions: Map<Reaction, number> = new Map();

  constructor(public chat: Chat, public job: Job) {
    super();

    this.chat.onMessage((username: string, message: string) => {
      this.onMessage(username, message);
    });
  }

  private onMessage(username: string, message: string) {
    // check if the username was null
    // we need a username for duplication checking
    if (username == null || message == null) {
      console.log("Null:", username, "or", message);
      return;
    }

    // get reactions from message
    const reaction: Reaction = getReactionByKeyword(message);
    // no reaction found
    if (reaction == null) {
      return;
    }

    console.log("Found reaction:", reaction);

    // ping job
    this.job.ping();

    // react to reaction
    this.react(username, reaction);
  }

  public getReaction(reaction: Reaction): number {
    return this.reactions.get(reaction) ?? 0;
  }

  public updateReaction(reaction: Reaction, mode: UpdateMode): number {
    let value = this.getReaction(reaction);

    // update value
    switch (mode) {
      case UpdateMode.INCREMENT:
        value++;
        break;
      case UpdateMode.DECREMENT:
        value--;
        break;
    }

    this.emit("update", reaction, value, mode);

    this.reactions.set(reaction, value);
    return value;
  }

  public react(username: string, reaction: Reaction) {
    // check if the user had any previous reactions
    if (this.clients.has(username)) {
      const oldReaction: Reaction = this.clients.get(username);

      // if the reactions are the same, ignore reaction
      if (oldReaction == reaction) {
        return;
      }

      // otherwise: decrement 1 from the old reaction
      this.updateReaction(oldReaction, UpdateMode.DECREMENT);
    }

    // increment reaction
    this.updateReaction(reaction, UpdateMode.INCREMENT);

    // link to username
    this.clients.set(username, reaction);

    // emit update
    this.emit("reaction", username, reaction);
  }

  public resetStorage(): void {
    this.clients.clear();
    this.reactions.clear();
  }

  public getValues(): number[] {
    const keys: number[] = [];
    const map: Map<number, number> = new Map();

    // collect reactions
    reactions.forEach((reaction: Reaction) => {
      map.set(reaction.sorting, this.getReaction(reaction));
      keys.push(reaction.sorting);
    });

    // ToDo: Rework my shitty sorting
    // or even better: rework this whole method
    // or event better better better: rework this whole project
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

  public drawChart(chart: Chart) {
    const values: number[] = this.getValues();
    console.log("Drawing chart", values);
    chart.draw(values, true, true);
  }
}
