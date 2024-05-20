const GIFEncoder = require("gifencoder");
const { createCanvas } = require("canvas");
const fs = require("fs");

const width = 400;
const height = 400;
const framesPerColor = 60; // Controls the speed of the waterfall effect
const waterfallHeight = 50; // Height of the moving color block

const colors = [
  [255, 0, 0], // red
  [0, 255, 0], // green
  [0, 0, 255], // blue
  [255, 255, 0], // yellow
];

const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(10); // Adjust for smoother animation speed
encoder.setQuality(10);

// eslint-disable-next-line no-unused-vars
const stream = encoder
  .createReadStream()
  .pipe(fs.createWriteStream("waterfallEffectGif.gif"));

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const lerp = (a, b, t) => a + (b - a) * t;

function getColorAtPosition(position, colors) {
  const colorIndex = Math.floor(position / waterfallHeight) % colors.length;
  const nextColorIndex = (colorIndex + 1) % colors.length;
  const localPosition = position % waterfallHeight;
  const t = localPosition / waterfallHeight;

  const startColor = colors[colorIndex];
  const endColor = colors[nextColorIndex];

  const r = Math.round(lerp(startColor[0], endColor[0], t));
  const g = Math.round(lerp(startColor[1], endColor[1], t));
  const b = Math.round(lerp(startColor[2], endColor[2], t));

  return `rgb(${r},${g},${b})`;
}

for (let frame = 0; frame < framesPerColor; frame++) {
  for (let y = 0; y < height; y += waterfallHeight) {
    ctx.fillStyle = getColorAtPosition(
      y + frame * (waterfallHeight / framesPerColor),
      colors,
    );
    ctx.fillRect(0, y, width, waterfallHeight);
  }
  encoder.addFrame(ctx);
}

encoder.finish();

console.log("Waterfall effect GIF created successfully!");
