import { EventEmitter } from "events";
import { Chart } from "./charts/chart";
import { Chat } from "./chats/chat";
import { Job } from "./job";
import { getReaction, getReactionByKeyword, Reaction, reactions } from "./keywords";

export enum UpdateMode {
  INCREMENT = 1,
  DECREMENT = -1,
}

/**
 * This class stores the reaction counts temporarily.
 * It waits for incoming messages of the chat {Chat#onMessage} and checks them for reactions.
 * If a reaction was found, it is counted and the job is notified.
 */
export class ReactionStorage extends EventEmitter {
  private users: Map<string, Reaction> = new Map();
  private reactions: Map<Reaction, number> = new Map();

  constructor(
    public chat: Chat,
    public job: Job,
    public duplicationChecking: boolean = true
  ) {
    super();

    this.chat.onMessage((username: string, message: string) => {
      this.onMessage(username, message);
    });
  }

  /**
   * Internal method, which is called as soon as a message is received.
   *
   * @param username Username of sender
   * @param message Message as text
   */
  private onMessage(username: string, message: string) {
    // check if the username was null
    // we need a username for duplication checking
    if (username == null || message == null) {
      console.log("[Storage]", "Null:", username, "or", message);
      return;
    }

    // get reactions from message
    const reaction: Reaction = getReaction(message, true);
    console.log("Found Reaction:", reaction);
    // no reaction found
    if (reaction == null) {
      return;
    }

    // ping job
    this.job.ping();

    // react to reaction
    this.react(username, reaction);
  }

  /**
   * Returns the number of reactions
   *
   * @param reaction Number of reactions
   * @default 0
   */
  public getReaction(reaction: Reaction): number {
    return this.reactions.get(reaction) ?? 0;
  }

  /**
   * Updates the number of a reaction.
   *
   * If INCREMENT was specified in {mode}, the number of reactions is increased by 1.
   * If DECREMENT is specified, the number is decreased by 1.
   *
   * @param reaction Reaction
   * @param mode UpdateMode: INCREMENT or DECREMENT
   */
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

    this.reactions.set(reaction, value);

    this.emit("update", reaction, value, mode);
    return value;
  }

  /**
   * This method is called when a user has responded. Among other things, it checks whether the user has already voted.
   *
   * If he has already voted with the same reaction, nothing further is done.
   * If he has voted with another reaction, this is subtracted and added to the new reaction.
   *
   * @param username Reactor's username
   * @param reaction Reaction
   */
  public react(username: string, reaction: Reaction) {
    // check for duplicates?
    if (this.duplicationChecking == true) {
      // check if the user had any previous reactions
      if (this.users.has(username)) {
        const oldReaction: Reaction = this.users.get(username);

        // if the reactions are the same, ignore reaction
        if (oldReaction == reaction) {
          return;
        }

        // otherwise: decrement 1 from the old reaction
        this.updateReaction(oldReaction, UpdateMode.DECREMENT);
      }

      // link to username
      this.users.set(username, reaction);
    }

    // increment reaction
    this.updateReaction(reaction, UpdateMode.INCREMENT);

    // emit update
    this.emit("reaction", username, reaction);
  }

  /**
   * Resets all stored reaction counts
   */
  public resetStorage(): void {
    this.users.clear();
    this.reactions.clear();

    console.log("[Storage]", "Reset users and reactions!");
  }

  /**
   * Returns the values of the reactions in the order given for the reactions under the {Reaction.sort} "sorting" number (ascending).
   * If there was no reaction, 0 is returned.
   * But the length of the array is always the length of {reactions}
   *
   * @returns Values of the reactions
   */
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

  /**
   * Draws the chart with the values
   * @param chart Chart
   */
  public drawChart(chart: Chart) {
    const values: number[] = this.getValues();
    chart.draw(values, true, true);
  }
}
