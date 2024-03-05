const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 400;
const height = 400;
const frames = 100; // Total number of frames in the GIF

const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
encoder.setDelay(10); // Frame delay in ms
encoder.setQuality(10); // Image quality, 1-20

// eslint-disable-next-line no-unused-vars
const stream = encoder.createReadStream().pipe(fs.createWriteStream('invertedColorTransition.gif'));

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Initial and final colors in RGB
const startColor = { r: 0, g: 0, b: 255 }; // Blue
const endColor = { r: 255, g: 255, b: 0 }; // Yellow

// Function to interpolate between two colors
function lerpColor(start, end, t) {
    return {
        r: Math.round(start.r + (end.r - start.r) * t),
        g: Math.round(start.g + (end.g - start.g) * t),
        b: Math.round(start.b + (end.b - start.b) * t),
    };
}

// Function to draw the canvas with interpolated color clusters
function drawFrame(frame) {
    const pixelData = ctx.getImageData(0, 0, width, height);
    const data = pixelData.data;

    // Loop over pixels and change colors
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < frame / frames) { // Increase probability over frames
            const t = frame / frames;
            const color = lerpColor(startColor, endColor, t);
            data[i] = color.r;
            data[i + 1] = color.g;
            data[i + 2] = color.b;
        }
    }

    ctx.putImageData(pixelData, 0, 0);
    encoder.addFrame(ctx);
}

// Generate frames
for (let frame = 0; frame <= frames; frame++) {
    drawFrame(frame);
}

encoder.finish();

console.log('Inverted color transition GIF created successfully!');
