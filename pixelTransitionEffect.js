const GIFEncoder = require("gifencoder");
const { createCanvas } = require("canvas");
const fs = require("fs");

const width = 400;
const height = 400;
const frames = 100; // Number of frames for the transition
const encoder = new GIFEncoder(width, height);

// Stream the encoded GIF to a file
// eslint-disable-next-line no-unused-vars
const stream = encoder
  .createWriteStream({ repeat: 0, delay: 20, quality: 10 })
  .pipe(fs.createWriteStream("pixelTransitionEffect.gif"));

encoder.start();

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Starting color (blue)
const startColor = { r: 0, g: 0, b: 255 };
// Target color (yellow)
const endColor = { r: 255, g: 255, b: 0 };

// Function to mix two colors with a specific ratio (0.0 - 1.0)
function mixColor(color1, color2, ratio) {
  return {
    r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
    g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
    b: Math.round(color1.b * (1 - ratio) + color2.b * ratio),
  };
}

for (let frame = 0; frame < frames; frame++) {
  // For each frame, adjust the ratio of target color based on current frame
  let ratio = frame / frames;
  let imageData = ctx.getImageData(0, 0, width, height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < ratio) {
      // Randomly decide to change the pixel color based on the ratio
      const mixedColor = mixColor(startColor, endColor, Math.random()); // Mix with a random ratio for variability
      data[i] = mixedColor.r;
      data[i + 1] = mixedColor.g;
      data[i + 2] = mixedColor.b;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  encoder.addFrame(ctx);
}

encoder.finish();
console.log("The GIF with pixel transition effect has been created.");
