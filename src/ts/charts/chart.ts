const SIZE_FILL: number = -1;
const LOCATION_CENTER: number = -2;

export interface ChartProperties {
  elementId: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  background?: string;
}

export abstract class Chart {
  //
  public canvasElementId: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  //
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public error: string;
  //

  constructor(properties: ChartProperties) {
    this.canvasElementId = properties.elementId;
    this.x = properties.x ?? 0;
    this.y = properties.y ?? 0;
    this.width = properties.width ?? SIZE_FILL;
    this.height = properties.height ?? SIZE_FILL;

    // if width == -1: width of display
    if (this.width === SIZE_FILL) {
      this.width = document.defaultView.innerWidth;
    } else if (this.x === LOCATION_CENTER) {
      this.x = document.defaultView.innerWidth / 2 - this.width / 2;
    }

    // if height == -1: height of display
    if (this.height == SIZE_FILL) {
      this.height = document.defaultView.innerHeight;
    } else if (this.x === LOCATION_CENTER) {
      this.y = document.defaultView.innerHeight / 2 - this.height / 2;
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

    // background
    this.canvas.style.background = properties.background ?? "#2c3e50";

    if (!this.error) {
      this.init();
    }
  }

  abstract init(): void;
  abstract draw(values: number[], drawText?: boolean, clear?: boolean): void;
}
