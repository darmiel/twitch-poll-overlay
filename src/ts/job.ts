import { EventEmitter } from "events";

export class Job extends EventEmitter {
  private timer: number | null;

  private current: number = 0;
  private currentPing: number = 0;

  constructor(
    public timeout: number = 10, // in s
    public requiredPings = 1
  ) {
    super();
  }

  /**
   * This internal method is executed every second as long as the timer is running.
   */
  private onTime(): void {
    this.current++;
    if (this.current >= this.timeout) {
      this.stopTimer();
      this.emit("cancel");
    }
  }

  public ping(): void {
    this.currentPing++;
    if (this.currentPing < this.requiredPings) {
      return;
    }

    this.current = 0;
    this.currentPing = 0;

    if (this.timer == null) {
      this.timer = window.setInterval(() => this.onTime(), 1000);
      this.emit("start");
    }
  }

  public stopTimer(): void {
    if (this.isActive()) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    // reset values
    this.current = 0;
    this.currentPing = 0;
  }

  public isActive(): boolean {
    return this.timer != null;
  }
}
