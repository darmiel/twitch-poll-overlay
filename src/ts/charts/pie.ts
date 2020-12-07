import { Chart, ChartProperties } from "./chart";
import { colors, darkenHexColor } from "../color";

const LOCATION_CENTER: number = -1;

export { LOCATION_CENTER };

////////////////////////////////////////////////////////////////////////

interface PieProperties extends ChartProperties {
  /**
   * 
   * The font size of the font that serves as a percentage display above the chart.
   * Use FONT_DYNAMIC to have the font size calculated according to the total size of the chart (dynamic)
   * @default 25
   */
  fontSize?: number;

  /**
   * Round the value?
   */
  round?: boolean;

  /**
   * (height or width) / {radiusFactor}
   */
  radiusFactor?: number;

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
}

const defaultPieParams: PieProperties = {
  elementId: "",
  fontSize: 25,
  round: true,
  radiusFactor: 4.5,
  fontFamily: "courier",
  fontColorFactor: 0.65,
};

////////////////////////////////////////////////////////////////////////

export class Pie extends Chart {
  /**
   * Radius of pie
   */
  public r: number;
  private endAngle: number;

  constructor(public properties: PieProperties) {
    super(properties);

    this.properties = { ...defaultPieParams, ...this.properties };

    if (this.x === LOCATION_CENTER) {
      this.x = this.width / 2;
    }
    if (this.y === LOCATION_CENTER) {
      this.y = this.height / 2;
    }

    this.r = Math.min(this.height, this.width) / this.properties.radiusFactor;
  }

  public init(): void {}

  public draw(
    values: number[],
    drawText: boolean = true,
    clear: boolean = true
  ): void {
    // draw
    if (clear) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // Alias to properties
    const prop = this.properties;

    const sum = values.reduce((a, c) => a + c);

    // reset endAngle
    this.endAngle = 0;

    // draw pie
    for (let i: number = 0; i < values.length; i++) {
      const value: number = (values[i] / sum) * 100;
      const color: string = colors[i % colors.length];

      const currentAngle = (Math.PI / 50) * value;
      console.log({ value, color, currentAngle, drawText });

      // draw basic pie chart
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.arc(
        this.x,
        this.y,
        this.r,
        this.endAngle - 0.5 * Math.PI,
        this.endAngle + currentAngle - 0.5 * Math.PI
      );
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.closePath();

      const beta = this.endAngle + currentAngle / 2;

      // format of text
      if (drawText) {
        this.ctx.fillStyle = darkenHexColor(
          this.ctx.fillStyle,
          prop.fontColorFactor
        );

        this.ctx.font = prop.fontSize + "px " + prop.fontFamily;

        let txt: string;
        if (prop.round) {
          txt = `${Math.round(value)}%`;
        } else {
          txt = `${value}$`;
        }

        // calculate text position
        const t = txt.length * 15;
        const h = 15;

        const Abs = this.r - 50;
        const Tx =
          this.x + (Math.sin(beta) * Abs + (t / 2) * (Math.sin(beta) - 1));
        const Ty =
          this.y - (Math.cos(beta) * Abs + (h / 2) * (Math.cos(beta) - 1));

        // draw text
        this.ctx.fillText(txt, Tx, Ty);
      }

      this.endAngle += currentAngle;
    }
  }
}