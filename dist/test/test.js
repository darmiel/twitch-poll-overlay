const color = require("./color");

// rgb(155, 89, 182)
// #9b59b6
const r = 155;
const g = 89;
const b = 182;

console.log("hex2RGB:");
console.log(color.hexToRgb("#9b59b6"));

console.log("RGB2YCbCr:");
const YCbCr = color.RGB2ToYCbCr(r, g, b);
console.log(YCbCr);

console.log("YCbCr2RGB:");
console.log(color.YCbCr2RGB(YCbCr[0], YCbCr[1], YCbCr[2]));

YCbCr[0] = YCbCr[0] * .7;
console.log("YCbCr2RGB:");
console.log(color.YCbCr2RGB(YCbCr[0], YCbCr[1], YCbCr[2]));