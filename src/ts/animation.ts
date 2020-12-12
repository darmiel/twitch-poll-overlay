import { EventEmitter } from "events";

/// Fade Animation
export abstract class Animation extends EventEmitter {}

export enum FadeDirection {
  IN,
  OUT,
}

export class CanvasAnimation extends Animation {
  private canvas: HTMLCanvasElement;
  //
  private intervalTimer: number | null;
  private timeoutTimer: number | null;
  //
  constructor(public elementId: string) {
    super();

    // get canvas
    const elem: HTMLElement = document.getElementById(this.elementId);
    if (!(elem instanceof HTMLCanvasElement)) {
      throw new Error("Canvas not found.");
    }

    this.canvas = elem;
  }

  public cancelInterval(): void {
    if (this.intervalTimer != null) {
      window.clearInterval(this.intervalTimer);
      this.intervalTimer = null;

      this.emit("cancelInterval");
    }
  }

  public cancelTimer(): void {
    if (this.timeoutTimer != null) {
      window.clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;

      this.emit("cancelInterval");
    }
  }

  public cancelAnimations(): void {
    this.cancelInterval();
    this.cancelTimer();
  }

  // 100
  public fade(
    durationInMs: number,
    smoothness: number,
    dir: FadeDirection
  ): void {
    this.cancelInterval();

    let current: number = 0;
    this.intervalTimer = window.setInterval(() => {
      current += smoothness;

      let opacity = current / durationInMs;
      if (dir == FadeDirection.OUT) {
        opacity = 1 - opacity;
      }

      this.canvas.style.opacity = `${opacity}`;

      console.log(`-> ${current}: ${opacity}%`);

      if (current >= durationInMs) {
        this.cancelInterval();
        this.emit("fadeEnd", durationInMs, smoothness, dir);
        return;
      }
    }, smoothness); // 10ms
  }

  public fadeIn(durationInMs: number, smoothness: number): void {
    this.fade(durationInMs, smoothness, FadeDirection.IN);
  }

  public fadeOut(durationInMs: number, smoothness: number): void {
    this.fade(durationInMs, smoothness, FadeDirection.OUT);
  }
}
