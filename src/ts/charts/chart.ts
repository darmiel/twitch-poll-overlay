export abstract class Chart {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public error: string;

  constructor(
    public canvasElementId: string,
    public width: number,
    public height: number
  ) {
    // if width == -1: width of display
    if (this.width == -1) {
      this.width = document.defaultView.innerWidth;
    }
    // if height == -1: height of display
    if (this.height == -1) {
      this.height = document.defaultView.innerHeight;
    }

    // find canvas
    const canvas = document.getElementById(this.canvasElementId);
    if (canvas == null) {
      this.error = "Canvas not found.";
      return;
    }
    this.canvas = <HTMLCanvasElement>canvas;

    // get context
    const ctx = this.canvas.getContext("2d");
    console.log("ctx:", ctx);
    if (ctx == null) {
      this.error = "Context not found.";
      return;
    }
    this.ctx = ctx;

    // make the canvas the size of width and height
    this.canvas.height = this.height;
    this.canvas.width = this.width;

    if (!this.error) {
        this.init();
    }
  }

  abstract init(): void;
  abstract draw(values: number[], drawText?: boolean, clear?: boolean): void;
}
