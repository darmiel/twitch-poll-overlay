

const RGB2ToYCbCr = (r, g, b) => {
  return [
    /* Y  */
    16 + (65.738 * r) / 256 + (129.057 * g) / 256 + (25.064 * b) / 256,
    /* Cb */
    128 - (37.945 * r) / 256 - (74.494 * g) / 256 + (112.439 * b) / 256,
    /* Cr */
    128 + (112.439 * r) / 256 - (94.154 * g) / 256 - (18.285 * b) / 256,
  ];
};

const YCbCr2RGB = (y, cb, cr) => {
  const Y = y - 16;
  const Cb = cb - 128;
  const Cr = cr - 128;

  return [
    /* R */ Math.round(Y * 1.164 + 1.596 * Cr),
    /* G */ Math.round(Y * 1.164 + Cb * -0.392 + Cr * -0.813),
    /* B */ Math.round(Y * 1.164 + Cb * 2.017),
  ];
};

const darkenColor = (r, g, b, mp) => {
  r = Math.max(0, r * mp);
  g = Math.max(0, g * mp);
  b = Math.max(0, b * mp);
  return rgb2hex(r, g, b);
};

const displayHeight = document.defaultView.innerHeight;
const displayWidth = document.defaultView.innerWidth;

const fontSize = 25;

const canvas = document.getElementById("canvas");
canvas.height = displayHeight;
canvas.width = displayWidth;

// background color
canvas.style.background = "#2c3e50";

/** @type CanvasRenderingContext2D */
const ctx = canvas.getContext("2d");

const colors = [
  // "#34495e",
  "#3498db",
  "#2ecc71",
  "#1abc9c",
  "#9b59b6",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
];


const values = [
 {
    value: 25,
  },
  {
    value: 50,
  },
  {
    value: 25,
  },
];

const pieX = displayWidth / 2;
const pieY = displayHeight / 2;
const pieRadius = Math.min(displayHeight, displayWidth) / 4.5;

let endAngle = 0;

for (let i = 0; i < values.length; i++) {
  const { value } = values[i];
  const color = colors[i % colors.length]; // get a new color for each layer

  const currentAngle = (Math.PI / 50) * value;

  // draw basic pie chart
  ctx.beginPath();
  ctx.moveTo(pieX, pieY);
  ctx.arc(
    pieX,
    pieY,
    pieRadius,
    endAngle - 0.5 * Math.PI,
    endAngle + currentAngle - 0.5 * Math.PI
  );
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  const beta = endAngle + currentAngle / 2;

  // format of text
  const rgbColor = hexToRgb(color);
  ctx.fillStyle = darkenColor(rgbColor[0], rgbColor[1], rgbColor[2], 0.65);
  ctx.font = fontSize + "px courier";

  const txt = `${value}%`;

  // calculate text position
  const t = txt.length * (15);
  const h = 15;

  const Abs = pieRadius - 50;
  const Tx = pieX + (Math.sin(beta) * Abs + (t / 2) * (Math.sin(beta) - 1));
  const Ty = pieY - (Math.cos(beta) * Abs + (h / 2) * (Math.cos(beta) - 1));

  // draw text
  ctx.fillText(txt, Tx, Ty);

  endAngle += currentAngle;
}