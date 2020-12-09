import { EventEmitter } from "events";

export class Job {
  private timer: number | null;

  private current: number = 0;
  private currentPing: number = 0;

  public ee: EventEmitter = new EventEmitter();

  constructor(
    public timeout: number = 10, // in s
    public requiredPings = 1
  ) {}

  public time(): void {
    this.current++;
    if (this.current >= this.timeout) {
      this.stopTimer();
      this.ee.emit("cancel");
    }
  }

  public ping(): void {
    this.currentPing ++;
    console.log("Current:", this.currentPing);

    if (this.currentPing < this.requiredPings) {
      return;
    }

    this.current = 0;
    this.currentPing = 0;

    if (this.timer == null) {
      this.timer = window.setInterval(() => this.time(), 1000);
      this.ee.emit("start");
    }
  }

  public stopTimer(): void {
    if (this.timer != null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    // reset values
    this.current = 0;
    this.currentPing = 0;
  }

  public on(event: string | symbol, listener: (...args: any[]) => void): void {
    this.ee.on(event, listener);
  }
}
