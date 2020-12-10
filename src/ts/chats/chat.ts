import { EventEmitter } from "events";

export abstract class Chat extends EventEmitter {
  constructor(
      public channel: string
  ) {
    super();
  }

  /**
   * Subscribe to the "message" event bus
   * Args:
   */
  public onMessage(
    listener: (username: string, message: string) => void
  ): void {
    this.on("message", listener);
  }

  protected emitMessage(username: string, message: string): void {
    this.emit("message", username, message);
  }

}