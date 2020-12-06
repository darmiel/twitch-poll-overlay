import { Chart } from "./chart";
import { colors, darkenHexColor } from "../color";

export class Pie extends Chart {
  public pieX: number;
  public pieY: number;
  public r: number;

  private endAngle: number;

  constructor(
    elemId: string,
    width: number = -1,
    height: number = -1,
    private fontSize: number = 25,
    private round: boolean = true
  ) {
    super(elemId, width, height);

    this.pieX = this.width / 2;
    this.pieY = this.height / 2;

    this.r = Math.min(this.height, this.width) / 4.5;
  }

  public init(): void {
  }

  public draw(values: number[], drawText: boolean = true, clear: boolean = true): void {
    // draw
    if (clear) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    const sum = values.reduce((a, c) => a + c);

    // reset endAngle
    this.endAngle = 0;

    // draw pie
    for (let i: number = 0; i < values.length; i++) {
      const value: number = values[i] / sum * 100;
      const color: string = colors[i % colors.length];
    
      const currentAngle = (Math.PI / 50) * value;
      console.log({value, color, currentAngle, drawText});
    
      // draw basic pie chart
      this.ctx.beginPath();
      this.ctx.moveTo(this.pieX, this.pieY);
      this.ctx.arc(
        this.pieX,
        this.pieY,
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
        console.log("> Drawing text!");
        this.ctx.fillStyle = darkenHexColor(this.ctx.fillStyle, 0.65);
        this.ctx.font = this.fontSize + "px courier";
      
        const txt = `${this.round ? Math.round(value) : value}%`;
      
        // calculate text position
        const t = txt.length * (15);
        const h = 15;
      
        const Abs = this.r - 50;
        const Tx = this.pieX + (Math.sin(beta) * Abs + (t / 2) * (Math.sin(beta) - 1));
        const Ty = this.pieY - (Math.cos(beta) * Abs + (h / 2) * (Math.cos(beta) - 1));
      
        // draw text
        this.ctx.fillText(txt, Tx, Ty);
      }

      this.endAngle += currentAngle;
    }
  }
}