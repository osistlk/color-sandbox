const fs = require('fs');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const directoryPath = '.'; // Current directory
const canvasWidth = 1920; // 1080p Width
const canvasHeight = 1080; // 1080p Height
const frameCount = 60; // Total number of frames for the animation
const encoder = new GIFEncoder(canvasWidth, canvasHeight);

// Stream the encoder's output to a file
encoder.createReadStream().pipe(fs.createWriteStream('animated_forest_1080p.gif'));
encoder.start();
encoder.setRepeat(0); // 0 for no repeat
encoder.setDelay(16); // Approximation to target a high frame rate feel
encoder.setQuality(10); // Image quality

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Forest color palette
function getForestColor() {
    const greenHues = [120, 133, 142]; // Green shades
    const brownHues = [25, 30, 35]; // Brown shades
    const hue = Math.random() > 0.75 ? brownHues[Math.floor(Math.random() * brownHues.length)] : greenHues[Math.floor(Math.random() * greenHues.length)]; // 75% chance for green
    const saturation = 60 + Math.random() * 40;
    const lightness = 30 + Math.random() * 20;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Function to simulate file sizes
function getFileSizes(dirPath) {
    return fs.readdirSync(dirPath).map(fileName => {
        const stats = fs.statSync(`${dirPath}/${fileName}`);
        // Use a placeholder size if needed, or derive sizes from stats
        return { fileName, size: stats.size };
    });
}

// Draws circles representing files, growing over time
function drawCircles(fileSizes, scaleFactor) {
    ctx.fillStyle = '#013220'; // Dark green background to represent the forest floor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    fileSizes.forEach((file, index) => {
        const baseSize = Math.sqrt(file.size) * scaleFactor; // Adjust base size to your needs
        const x = (canvasWidth / fileSizes.length) * index + baseSize; // Distribute circles along the width
        const y = canvasHeight / 2; // Align circles vertically in the middle
        const radius = baseSize * scaleFactor; // Radius grows with scaleFactor

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getForestColor();
        ctx.fill();
    });
}

const fileSizes = getFileSizes(directoryPath).sort((a, b) => a.size - b.size);

// Gradual growth animation loop
for (let frame = 0; frame < frameCount; frame++) {
    const scaleFactor = (frame + 1) / frameCount; // Gradually increase size over frames
    drawCircles(fileSizes, scaleFactor);
    encoder.addFrame(ctx);
}

encoder.finish();
console.log('The animated 1080p forest-themed GIF has been created.');
