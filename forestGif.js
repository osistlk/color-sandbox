const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 1200;
const height = 1200;
const frames = 60;

const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0); // 0 for infinite loop
encoder.setDelay(50); // Frame delay in ms
encoder.setQuality(20); // Image quality from 1-20

// eslint-disable-next-line no-unused-vars
const stream = encoder.createWriteStream()
    .pipe(fs.createWriteStream('forestScene.gif'));

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Define the color palette
const colors = {
    sky: '#87CEEB',
    ground: '#8B4513',
    treeTrunk: '#8B4513',
    foliage: '#228B22'
};

// Draw the static background
ctx.fillStyle = colors.sky;
ctx.fillRect(0, 0, width, height / 2);
ctx.fillStyle = colors.ground;
ctx.fillRect(0, height / 2, width, height / 2);

// Function to draw a tree
function drawTree(x, y) {
    // Draw the trunk
    ctx.fillStyle = colors.treeTrunk;
    ctx.fillRect(x - 5, y - 20, 10, 20);

    // Draw the foliage
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - 20, y);
    ctx.lineTo(x + 20, y);
    ctx.closePath();
    ctx.fillStyle = colors.foliage;
    ctx.fill();
}

// Generate frames for the GIF
for (let frame = 0; frame < frames; frame++) {
    // We draw on the existing canvas, so only draw the part that changes
    let x = (frame / frames) * width;
    let y = height / 2;

    // Draw two trees moving
    drawTree(x, y);
    drawTree(width - x, y);

    // Add the frame to the GIF
    encoder.addFrame(ctx);
}

encoder.finish();

console.log('Forest scene GIF created successfully!');
