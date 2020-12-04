const rgb2hex = (r, g, b) => {
  const rgb = ((r << 16) | (g << 8) | b) & 0xffffff;
  console.log("r g b: ", r, g, b);
  console.log("rgb: " + rgb);
  return rgb.toString(16);
};

const hexToRgb = (hex) => {
  if (hex.startsWith("#")) {
    hex = hex.substring(1);
  }

  const rgb = parseInt(hex, 16);

  return [
    /* R */ (rgb >> 16) & 0xff,
    /* G */ (rgb >> 8) & 0xff,
    /* B */ rgb & 0xff,
  ];
};

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

const darkenColor = (hex, mp) => {
  const rgb = hexToRgb(hex);
  const ycbcr = RGB2ToYCbCr(rgb[0], rgb[1], rgb[2]);
  const darkenrgb = YCbCr2RGB(ycbcr[0] * (1 - mp), ycbcr[1], ycbcr[2]);
  const rgbhex = rgb2hex(darkenrgb[0], darkenrgb[1], darkenrgb[2]);
  return rgbhex;
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
    text: "Daniel",
    value: 33,
  },
  {
    text: "Simon",
    value: 15,
  },
  {
    text: "Max",
    value: 40,
  },
];

const pieX = displayWidth / 2;
const pieY = displayHeight / 2;
const pieRadius = Math.min(displayHeight, displayWidth) / 4.5;

let endAngle = 0;

for (let i = 0; i < values.length; i++) {
  const { text, value } = values[i];
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
  const a = pieRadius + 40;
  const textX = pieX + a * Math.sin(beta);
  const textY = pieY - a * Math.cos(beta);

  ctx.fillStyle = "#000000"; //darkenColor(color, 0.15);
  ctx.font = fontSize + "px courier";

  const txt = `${value}%`;
  ctx.fillText(txt, textX, textY);

  endAngle += currentAngle;
}
