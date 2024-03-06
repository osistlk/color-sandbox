const fs = require('fs');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');
const ProgressBar = require('progress');

const directoryPath = '.'; // Current directory
const canvasWidth = 1920; // 1080p Width
const canvasHeight = 1080; // 1080p Height
const frameCount = 60; // Total number of frames for the animation
const encoder = new GIFEncoder(canvasWidth, canvasHeight);

// Initialize the progress bar
const bar = new ProgressBar('Generating GIF [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: frameCount
});

// Stream the encoder's output to a file
encoder.createReadStream().pipe(fs.createWriteStream('animated_forest_1080p.gif'));
encoder.start();
encoder.setRepeat(0); // 0 for no repeat
encoder.setDelay(16); // Approximation to target a high frame rate feel
encoder.setQuality(10); // Image quality

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

function getForestColor() {
    // Implement the getForestColor function as before.
    return 'hsl(' + Math.floor(Math.random() * 360) + ', 50%, 50%)'; // Placeholder
}

function getFileSizes(dirPath) {
    // Implement the getFileSizes function as before.
    return fs.readdirSync(dirPath).map(fileName => {
        const stats = fs.statSync(`${dirPath}/${fileName}`);
        return { fileName, size: stats.size };
    }).sort(() => 0.5 - Math.random()); // Shuffle for variation
}

function drawCircles(fileSizes, scaleFactor) {
    ctx.fillStyle = '#013220'; // Dark green background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    fileSizes.forEach((file, index) => {
        // Your circle drawing logic here.
    });
}

const fileSizes = getFileSizes(directoryPath);

// Animation loop
for (let frame = 0; frame < frameCount; frame++) {
    const scaleFactor = (frame + 1) / frameCount;
    drawCircles(fileSizes, scaleFactor);
    encoder.addFrame(ctx);
    bar.tick(); // Update the progress bar for each frame generated
}

encoder.finish();
console.log('The animated 1080p forest-themed GIF has been created.');
