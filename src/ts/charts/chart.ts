const SIZE_FILL: number = -1;
const LOCATION_CENTER: number = -2;

export enum ChartType {
  BAR = "bar",
  PIE = "pie",
}

export interface FontProperties {
  /**
   *
   * The font size of the font that serves as a percentage display above the chart.
   * Use FONT_DYNAMIC to have the font size calculated according to the total size of the chart (dynamic)
   * @default 25
   */
  fontSize?: number;
  /**
   * The font family for the values
   * @default calibri
   */
  fontFamily?: string;
  /**
   * How much the text color should be darkened
   * @default .65
   */
  fontColorFactor?: number;
  /**
   * The font in the calculation by the factor {fontSizeFactor}
   * @default 1/8
   */
  fontSizeFactor?: number;
}

export interface ChartProperties {
  elementId?: string;
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
    this.canvasElementId = properties.elementId ?? "canvas";
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
    if (ctx == null) {
      this.error = "Context not found.";
      return;
    }
    this.ctx = ctx;

    // make the canvas the size of width and height
    this.canvas.height = this.height;
    this.canvas.width = this.width;

    // background
    if ((properties.background ?? "#2c3e50") != "none") {
      this.canvas.style.background = properties.background ?? "#2c3e50";
    }

    if (!this.error) {
      this.init();
    }

    console.log(properties);
  }

  abstract init(): void;
  abstract draw(values: number[], drawText?: boolean, clear?: boolean): void;
  abstract clear(): void;
}
