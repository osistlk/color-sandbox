const GIFEncoder = require("gifencoder");
const { createCanvas } = require("canvas");
const fs = require("fs");

const width = 400;
const height = 400;
const framesPerColor = 20; // Increase for smoother transitions

const colors = [
  [255, 0, 0], // red
  [255, 127, 0], // orange
  [255, 255, 0], // yellow
  [0, 255, 0], // lime
  [0, 0, 255], // blue
  [75, 0, 130], // indigo
  [148, 0, 211], // violet
];

const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(50); // Adjust frame delay for speed
encoder.setQuality(10);

// eslint-disable-next-line no-unused-vars
const stream = encoder
  .createReadStream()
  .pipe(fs.createWriteStream("smoothTransitionGif.gif"));

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const lerp = (a, b, t) => a + (b - a) * t;

for (let i = 0; i < colors.length; i++) {
  const startColor = colors[i];
  const endColor = colors[(i + 1) % colors.length];

  for (let j = 0; j < framesPerColor; j++) {
    const t = j / (framesPerColor - 1);
    const r = Math.round(lerp(startColor[0], endColor[0], t));
    const g = Math.round(lerp(startColor[1], endColor[1], t));
    const b = Math.round(lerp(startColor[2], endColor[2], t));

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, width, height);
    encoder.addFrame(ctx);
  }
}

encoder.finish();

console.log("Smooth transition GIF created successfully!");
