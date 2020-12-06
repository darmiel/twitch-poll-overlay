/* Settings */
const barMarginHeight = 100;
const barMarginWidth = 100;
const strokeMarginHeight = 5;
const strokeMarginWidth = 5;

export interface Color {
  value: number;
}

// colors for the bar
const colors: Array<string> = [
  "#3498db",
  "#f1c40f",
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#1abc9c",
  "#9b59b6",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
];

export interface Reaction {
  color: Color;
  order: number; // -oo <- left | +oo <- right
  words: string[];
}

const reactions: Map<number, Reaction> = new Map([
  [0, { order: 0, color: { value: 0x2ecc71 }, words: ["1", "ja", "yes"] }],
  [50, { order: 50, color: { value: 0x2980b9 }, words: ["2", "wtf"] }],
  [100, { order: 100, color: { value: 0x8e44ad }, words: ["0", "nein", "no"] }],
]);

interface ReactionValue {
  reaction: number;
  value: number;
}

function RGB2Hex(r: number, g: number, b: number): string {
  const rgb: number = ((r << 16) | (g << 8) | b) & 0xffffff;
  return rgb.toString(16);
}

function Hex2RGB(hex: string): Array<number> {
  if (hex.startsWith("#")) {
    hex = hex.substring(1);
  }

  const rgb: number = parseInt(hex, 16);

  return [
    /* R */ (rgb >> 16) & 0xff,
    /* G */ (rgb >> 8) & 0xff,
    /* B */ rgb & 0xff,
  ];
}

function darkenRGBColor(r: number, g: number, b: number, mp: number): string {
  r = Math.max(0, r * mp);
  g = Math.max(0, g * mp);
  b = Math.max(0, b * mp);
  return RGB2Hex(r, g, b);
}

function darkenHexColor(hex: string, mp: number): string {
  const rgb = Hex2RGB(hex);
  return darkenRGBColor(rgb[0], rgb[1], rgb[2], mp);
}

////////////////////////////////////////////////////////////

let ctx: CanvasRenderingContext2D;
let height: number;
let width: number;

function init(): boolean {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.getElementById("canvas")
  );
  console.log(canvas);
  if (document == null || document.defaultView == null) {
    console.log("Document / defaultView not available.");
    return false;
  }

  let a: number = -1;

  // scale canvas to display height / width
  height = document.defaultView.innerHeight;
  width = document.defaultView.innerWidth;
  canvas.height = height;
  canvas.width = width;

  // background-color: #2c3e50
  canvas.style.background = "#2c3e50";

  const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (context == null) {
    console.log("Context not available.");
    return false;
  }

  ctx = context;

  return true;
}

export function drawBar(values: Array<number>) {
  // clear rect
  ctx.clearRect(0, 0, width, height);

  const rectWidth: number = width - barMarginWidth * 2;
  const rectHeight: number = height - barMarginHeight * 2;

  // properties
  const fontSize = rectHeight * (2 / 3);
  const fontMp = fontSize / 1.8;
  ctx.font = `${fontSize}px courier`;
  ctx.strokeStyle = "#34495e";

  // stroke
  ctx.beginPath();
  ctx.rect(
    barMarginWidth - strokeMarginWidth,
    barMarginHeight - strokeMarginHeight,
    rectWidth + strokeMarginWidth * 2,
    rectHeight + strokeMarginHeight * 2
  );
  ctx.stroke();
  ctx.closePath();

  // count the sum of all reactions
  // let sum = val.map(c => c.value).reduce((a, c) => a + c);
  const sum = values.reduce((a, c) => a + c);

  let lastX = barMarginWidth; // 50 -> starting pos
  for (let i: number = 0; i < values.length; i++) {
    const v: number = values[i];
    const percentage: number = v / sum;

    const valueWidth: number = rectWidth * percentage;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.rect(lastX, barMarginHeight, valueWidth, rectHeight);
    ctx.fill();
    ctx.closePath();

    // draw text
    ctx.beginPath();
    ctx.fillStyle = darkenHexColor(ctx.fillStyle, 0.65);
    const txt: string = `${Math.round(percentage * 100)}%`;
    ctx.fillText(
      txt,
      lastX + valueWidth / 2 - (fontMp * txt.length) / 2,
      barMarginHeight + rectHeight / 2 + fontMp / 2
    );
    ctx.closePath();

    lastX += valueWidth;

    console.log({v, percentage, valueWidth});
  }
}

if (init()) {
    let val1 = 10;
    let val2 = 1000;

    const iv = setInterval(() => {
        drawBar([val1, val2]);
        val1 += 10;

        if (val1 > val2*2) {
            clearInterval(iv);
        }
    }, 100);
}
