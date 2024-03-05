const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const width = 400;
const height = 400;
const frames = 60; // Adjust for a smoother or quicker transition

const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(100); // Adjust delay between frames for speed of transition
encoder.setQuality(10); // 10 is default quality

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Initialize the canvas with the starting color
ctx.fillStyle = 'rgb(0, 0, 255)'; // Start with blue
ctx.fillRect(0, 0, width, height);

const startColor = { r: 0, g: 0, b: 255 }; // Blue
const endColor = { r: 255, g: 255, b: 0 }; // Yellow
const changeRate = 0.01; // Rate of color change per frame

// Function to interpolate color
function interpolateColor(color1, color2, factor) {
    if (factor > 1) factor = 1;
    const result = { r: 0, g: 0, b: 0 };
    result.r = Math.round(color1.r + factor * (color2.r - color1.r));
    result.g = Math.round(color1.g + factor * (color2.g - color1.g));
    result.b = Math.round(color1.b + factor * (color2.b - color1.b));
    return result;
}

// Generate frames
for (let frame = 0; frame <= frames; frame++) {
    let factor = frame / frames;
    let pixelData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < pixelData.data.length; i += 4) {
        // Randomly decide if the pixel should start changing color
        if (Math.random() < factor) {
            let color = interpolateColor(startColor, endColor, Math.random() * factor);
            pixelData.data[i] = color.r; // R
            pixelData.data[i + 1] = color.g; // G
            pixelData.data[i + 2] = color.b; // B
        }
    }
    ctx.putImageData(pixelData, 0, 0);
    encoder.addFrame(ctx);
}

encoder.finish();
console.log('Inverted color transition GIF created successfully!');
