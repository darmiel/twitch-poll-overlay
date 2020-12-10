import { colors, darkenHexColor } from "../color";
import { Chart, ChartProperties } from "./chart";

const FONT_DYNAMIC: number = -1;
export { FONT_DYNAMIC };

////////////////////////////////////////////////////////////////////////

export interface BarProperties extends ChartProperties {
  /**
   * The distance of the height (bottom and top) to the edge of the canvas
   * @default 0
   */
  barMarginHeight?: number;

  /**
   * The distance of the width (left and right) to the edge of the canvas
   * @default 0
   */
  barMarginWidth?: number;

  /**
   * The top and bottom distance between
   * the outline of the ProgressBar and the filled in
   * @default 5
   */
  strokeMarginHeight?: number;

  /**
   * The left and right distance between
   * the outline of the ProgressBar and the filled in
   * @default 5
   */
  strokeMarginWidth?: number;

  /**
   * The colors from this array are gradually used for the colors of the values of the bar.
   * If there are less colors in the array than values,
   * the next color is taken from the beginning again.
   * @default {../color.ts::colors}
   */
  valueColors?: string[];

  /**
   * This color is used for the border of the bar.
   * @default #34495e (light gray)
   */
  strokeColor?: string;

  /**
   * How often should the contour be drawn? (Or also: the thickness of the stroke)
   */
  strokeIterations?: number;

  /**
   * The font size of the font that serves as a percentage display above the chart.
   * Use FONT_DYNAMIC to have the font size calculated according to the total size of the chart (dynamic)
   * @default FONT_DYNAMIC
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

  /**
   * Round the value?
   */
  textRound?: boolean;
}

const defaultBarProperties: BarProperties = {
  elementId: "",
  barMarginHeight: 10,
  barMarginWidth: 10,
  strokeMarginHeight: 5,
  strokeMarginWidth: 5,
  valueColors: colors,
  strokeColor: "#34495e",
  strokeIterations: 1,
  fontSize: FONT_DYNAMIC,
  fontFamily: "courier",
  fontSizeFactor: 1.8,
  fontColorFactor: 0.65,
  textRound: true,
};

////////////////////////////////////////////////////////////////////////

export class Bar extends Chart {
  constructor(public properties: BarProperties) {
    super(properties);
    this.properties = { ...defaultBarProperties, ...this.properties };
    console.log(this.properties);
  }

  public init(): void {}

  /**
   * Draw the bar
   *
   * @param values An array of values
   * @param drawText Draw the percentage on top?
   * @param clear Clear the canvas before drawing?
   */
  public draw(
    values: number[],
    drawText: boolean = true,
    clear: boolean = true
  ): void {
    // draw
    if (clear) {
      this.clear();
    }

    const prop = this.properties;

    const rectWidth: number = this.width - prop.barMarginWidth * 2;
    const rectHeight: number = this.height - prop.barMarginHeight * 2;

    // properties
    let fontSize = prop.fontSize;
    if (fontSize === FONT_DYNAMIC) {
      fontSize = rectHeight * (2 / 3);
    }

    const fontMp = fontSize / prop.fontSizeFactor;
    this.ctx.font = `${Math.round(fontSize)}px ${prop.fontFamily}`;
    this.ctx.strokeStyle = prop.strokeColor;

    // stroke
    for (let j: number = 0; j < prop.strokeIterations; j++) {
      this.ctx.beginPath();
      this.ctx.rect(
        this.x + prop.barMarginWidth - prop.strokeMarginWidth - j,
        this.y + prop.barMarginHeight - prop.strokeMarginHeight - j,
        rectWidth + prop.strokeMarginWidth * 2 + j,
        rectHeight + prop.strokeMarginHeight * 2 + j
      );
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // count the sum of all reactions
    // let sum = val.map(c => c.value).reduce((a, c) => a + c);
    const sum = values.reduce((a, c) => a + c);

    let lastX = prop.barMarginWidth; // 50 -> starting pos
    for (let i: number = 0; i < values.length; i++) {
      const v: number = values[i];
      const percentage: number = v / sum;

      if (percentage == 0) {
        continue;
      }

      const valueWidth: number = rectWidth * percentage;

      this.ctx.fillStyle = prop.valueColors[i % prop.valueColors.length];
      this.ctx.beginPath();
      this.ctx.rect(
        this.x + lastX,
        this.y + prop.barMarginHeight,
        valueWidth,
        rectHeight
      );
      this.ctx.fill();
      this.ctx.closePath();

      // draw text
      if (drawText) {
        let txt: string;
        if (prop.textRound) {
          txt = `${Math.round(percentage * 100)}%`;
        } else {
          txt = `${percentage * 100}%`;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = darkenHexColor(
          this.ctx.fillStyle,
          prop.fontColorFactor
        );
        this.ctx.fillText(
          txt,
          this.x + lastX + valueWidth / 2 - (fontMp * txt.length) / 2,
          this.y + prop.barMarginHeight + rectHeight / 2 + fontMp / 2
        );
        this.ctx.closePath();
      }

      lastX += valueWidth;
    }
  }

  public clear(): void {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}
