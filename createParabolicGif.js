const GIFEncoder = require("gifencoder");
const ProgressBar = require("progress");

const { createCanvas } = require("canvas");
const fs = require("fs");

const width = 2560;
const height = 1440;
const frameCount = 144; // Total number of frames in the GIF

const colors = [
  [255, 0, 0], // red
  [0, 255, 0], // green
  [0, 0, 255], // blue
  [255, 255, 0], // yellow
];

const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
encoder.setDelay(50); // Frame delay in ms for animation speed
encoder.setQuality(10); // Image quality, 1-20

// eslint-disable-next-line no-unused-vars
const stream = encoder
  .createReadStream()
  .pipe(fs.createWriteStream("parabolicColorTransition.gif"));

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const lerp = (a, b, t) => a + (b - a) * t;

function getColor(t) {
  const totalColors = colors.length;
  const scaledT = t * (totalColors - 1);
  const i = Math.floor(scaledT);
  const tNormalized = scaledT - i;

  const color1 = colors[i % totalColors];
  const color2 = colors[(i + 1) % totalColors];

  const r = Math.round(lerp(color1[0], color2[0], tNormalized));
  const g = Math.round(lerp(color1[1], color2[1], tNormalized));
  const b = Math.round(lerp(color1[2], color2[2], tNormalized));

  return `rgb(${r},${g},${b})`;
}

// Create a new progress bar instance
const bar = new ProgressBar(":bar :percent ETA :etas", {
  total: frameCount,
  width: 30,
  clear: true,
});

for (let frame = 0; frame < frameCount; frame++) {
  const t = (Math.sin((frame / frameCount) * Math.PI * 2) + 1) / 2; // Parabolic effect

  ctx.fillStyle = getColor(t);
  ctx.fillRect(0, 0, width, height);

  encoder.addFrame(ctx);

  // Update the progress bar
  bar.tick();
}

encoder.finish();

console.log("Parabolic color transition GIF created successfully!");
