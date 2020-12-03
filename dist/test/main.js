const displayHeight = document.defaultView.innerHeight;
const displayWidth = document.defaultView.innerWidth;

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
  /*{

    text: "",
    value: 100,
    base: true,
  },*/
  {
    text: "Daniel",
    value: 25,
  },
  {
    text: "Simon",
    value: 15,
  },
  {
    text: "Max",
    value: 10,
  },
  {
    text: "Max",
    value: 16,
  },
];

const pieX = displayWidth / 2;
const pieY = displayHeight / 2;
const pieRadius = Math.min(displayHeight, displayWidth) / 4.5;

let angle = Math.PI * 1.5;

let endAngle = 1.5 * Math.PI;

for (let i = 0; i < values.length; i++) {
  const { text, value } = values[i];
  const color = colors[i % colors.length]; // get a new color for each layer

  const currentAngle = (Math.PI / 50) * value;

  // draw basic pie chart
  ctx.beginPath();
  ctx.moveTo(pieX, pieY);
  ctx.arc(pieX, pieY, pieRadius, endAngle, endAngle + currentAngle);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  // ! Koordinaten Text
  const beta = (endAngle - 1.5*Math.PI) + currentAngle / 2;
  const textX = (pieRadius + 20) * Math.sin(beta) + pieX;
  const textY = (pieRadius + 20) * Math.cos(beta) + pieY;

  ctx.fillText(`${value}%`, textX, textY);

  console.log({
    pieX,
    pieY,
    endAngle,
    currentAngle,
    beta,
    textX,
    textY,
  });

  endAngle += currentAngle;
}