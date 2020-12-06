import { colors, darkenHexColor } from "../color";
import { Chart } from "./chart";
export class Bar extends Chart {

  constructor(
    elemId: string,
    height: number = -1,
    width: number = -1,
    private fontSize: number = -1,
    private background: string = "#2c3e50",
    private barMarginHeight: number = 100,
    private barMarginWidth: number = 100,
    private strokeMarginHeight: number = 5,
    private strokeMarginWidth: number = 5
  ) {
    super(elemId, width, height);
  }

  public init(): void {
    if (this.error) {
      console.log("Skipped init because of an error");
      return;
    }

    // background
    this.canvas.style.background = this.background;
  }

  /**
   * Draw the bar
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
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    const rectWidth: number = this.width - this.barMarginWidth * 2;
    const rectHeight: number = this.height - this.barMarginHeight * 2;

    // properties
    const fontSize = this.fontSize == -1 ? rectHeight * (2 / 3) : this.fontSize;
    const fontMp = fontSize / 1.8;
    this.ctx.font = `${fontSize}px courier`;
    this.ctx.strokeStyle = "#34495e";

    // stroke
    this.ctx.beginPath();
    this.ctx.rect(
      this.barMarginWidth - this.strokeMarginWidth,
      this.barMarginHeight - this.strokeMarginHeight,
      rectWidth + this.strokeMarginWidth * 2,
      rectHeight + this.strokeMarginHeight * 2
    );
    this.ctx.stroke();
    this.ctx.closePath();

    // count the sum of all reactions
    // let sum = val.map(c => c.value).reduce((a, c) => a + c);
    const sum = values.reduce((a, c) => a + c);
    console.log({ rectWidth, rectHeight, fontSize, fontMp, sum });

    let lastX = this.barMarginWidth; // 50 -> starting pos
    for (let i: number = 0; i < values.length; i++) {
      const v: number = values[i];
      const percentage: number = v / sum;

      const valueWidth: number = rectWidth * percentage;

      this.ctx.fillStyle = colors[i % colors.length];
      this.ctx.beginPath();
      this.ctx.rect(lastX, this.barMarginHeight, valueWidth, rectHeight);
      this.ctx.fill();
      this.ctx.closePath();

      // draw text
      if (drawText) {
        console.log("Draw Text!");
        const txt: string = `${Math.round(percentage * 100)}%`;

        this.ctx.beginPath();
        this.ctx.fillStyle = darkenHexColor(this.ctx.fillStyle, 0.65);
        this.ctx.fillText(
          txt,
          lastX + valueWidth / 2 - (fontMp * txt.length) / 2,
          this.barMarginHeight + rectHeight / 2 + fontMp / 2
        );
        this.ctx.closePath();
      }

      lastX += valueWidth;
    }
  }
}