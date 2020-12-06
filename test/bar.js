"use strict";
/* Settings */
var barMarginHeight = 100;
var barMarginWidth = 50;
var strokeMarginHeight = 5;
var strokeMarginWidth = 5;
// colors for the bar
var colors = [
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
var reactions = new Map([
    [0, { order: 0, color: { value: 0x2ecc71 }, words: ["1", "ja", "yes"] }],
    [50, { order: 50, color: { value: 0x2980b9 }, words: ["2", "wtf"] }],
    [100, { order: 100, color: { value: 0x8e44ad }, words: ["0", "nein", "no"] }],
]);
function RGB2Hex(r, g, b) {
    var rgb = ((r << 16) | (g << 8) | b) & 0xffffff;
    return rgb.toString(16);
}
function Hex2RGB(hex) {
    if (hex.startsWith("#")) {
        hex = hex.substring(1);
    }
    var rgb = parseInt(hex, 16);
    return [
        /* R */ (rgb >> 16) & 0xff,
        /* G */ (rgb >> 8) & 0xff,
        /* B */ rgb & 0xff,
    ];
}
function darkenRGBColor(r, g, b, mp) {
    r = Math.max(0, r * mp);
    g = Math.max(0, g * mp);
    b = Math.max(0, b * mp);
    return RGB2Hex(r, g, b);
}
function darkenHexColor(hex, mp) {
    var rgb = Hex2RGB(hex);
    return darkenRGBColor(rgb[0], rgb[1], rgb[2], mp);
}
////////////////////////////////////////////////////////////
var ctx;
var height;
var width;
function init() {
    var canvas = (document.getElementById("canvas"));
    console.log(canvas);
    if (document == null || document.defaultView == null) {
        console.log("Document / defaultView not available.");
        return false;
    }
    var a = -1;
    // scale canvas to display height / width
    height = document.defaultView.innerHeight;
    width = document.defaultView.innerWidth;
    canvas.height = height;
    canvas.width = width;
    // background-color: #2c3e50
    canvas.style.background = "#2c3e50";
    var context = canvas.getContext("2d");
    if (context == null) {
        console.log("Context not available.");
        return false;
    }
    ctx = context;
    return true;
}
function drawBar(values) {
    // clear rect
    ctx.clearRect(0, 0, width, height);
    var rectWidth = width - barMarginWidth * 2;
    var rectHeight = height - barMarginHeight * 2;
    // properties
    var fontSize = rectHeight * (2 / 3);
    var fontMp = fontSize / 1.8;
    ctx.font = fontSize + "px courier";
    ctx.strokeStyle = "#34495e";
    // stroke
    ctx.beginPath();
    ctx.rect(barMarginWidth - strokeMarginWidth, barMarginHeight - strokeMarginHeight, rectWidth + strokeMarginWidth * 2, rectHeight + strokeMarginHeight * 2);
    ctx.stroke();
    ctx.closePath();
    // count the sum of all reactions
    // let sum = val.map(c => c.value).reduce((a, c) => a + c);
    var sum = values.reduce(function (a, c) { return a + c; });
    var lastX = barMarginWidth; // 50 -> starting pos
    for (var i = 0; i < values.length; i++) {
        var v = values[i];
        var percentage = v / sum;
        var valueWidth = rectWidth * percentage;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.rect(lastX, barMarginHeight, valueWidth, rectHeight);
        ctx.fill();
        ctx.closePath();
        // draw text
        ctx.beginPath();
        ctx.fillStyle = darkenHexColor(ctx.fillStyle, 0.65);
        var txt = Math.round(percentage * 100) + "%";
        ctx.fillText(txt, lastX + valueWidth / 2 - (fontMp * txt.length) / 2, barMarginHeight + rectHeight / 2 + fontMp / 2);
        ctx.closePath();
        lastX += valueWidth;
        console.log({ v: v, percentage: percentage, valueWidth: valueWidth });
    }
}
if (init()) {
    var val1_1 = 10;
    var val2_1 = 1000;
    var iv_1 = setInterval(function () {
        drawBar([val1_1, val2_1]);
        val1_1 += 10;
        if (val1_1 > val2_1 * 10) {
            clearInterval(iv_1);
        }
    }, 100);
}
