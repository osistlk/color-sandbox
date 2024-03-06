const fs = require('fs');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const directoryPath = '.'; // Current directory
const canvasWidth = 3840; // 4K Width
const canvasHeight = 2160; // 4K Height
const frameCount = 60; // Increase the number of frames for smoother animation
const encoder = new GIFEncoder(canvasWidth, canvasHeight);

// Stream the encoder's output to a file
encoder.createReadStream().pipe(fs.createWriteStream('smooth_animated_forest_4k.gif'));
encoder.start();
encoder.setRepeat(0); // 0 for no repeat
encoder.setDelay(50); // Reduce delay between frames for a smoother animation
encoder.setQuality(10); // Image quality

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Function to generate a mix of green and brown colors
function getForestColor() {
    const colorType = Math.random(); // Randomly decide the color type (green or brown)
    let color;
    if (colorType < 0.8) { // 80% chance to be green
        const h = Math.floor(Math.random() * (120 - 85) + 85); // Hue for green shades
        const s = Math.floor(Math.random() * (100 - 50) + 50); // Saturation for rich color
        const l = Math.floor(Math.random() * (60 - 30) + 30); // Lightness for depth
        color = `hsl(${h}, ${s}%, ${l}%)`;
    } else { // 20% chance to be brown
        const h = Math.floor(Math.random() * (30 - 20) + 20); // Hue for brown shades
        const s = Math.floor(Math.random() * (100 - 40) + 40); // Saturation for earthy color
        const l = Math.floor(Math.random() * (50 - 20) + 20); // Lightness for depth
        color = `hsl(${h}, ${s}%, ${l}%)`;
    }
    return color;
}

// Function to get file sizes from the current directory
function getFileSizes(dirPath) {
    const fileStats = fs.readdirSync(dirPath).map(fileName => {
        const stats = fs.statSync(`${dirPath}/${fileName}`);
        return { fileName, size: stats.size };
    });
    // Shuffle and sort by size, largest first
    return fileStats
        .sort(() => 0.5 - Math.random())
        .sort((a, b) => b.size - a.size);
}

// Function to draw non-overlapping circles based on file sizes
function drawCircles(fileSizes, scaleFactor) {
    ctx.fillStyle = '#013220'; // Dark green background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let filledArea = [];

    fileSizes.forEach(file => {
        let targetArea = (file.size / fileSizes.reduce((a, b) => a + b.size, 0)) * (canvasWidth * canvasHeight);
        let radius = Math.sqrt(targetArea / Math.PI) * scaleFactor;

        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 1000) {
            let x = Math.random() * (canvasWidth - radius * 2) + radius;
            let y = Math.random() * (canvasHeight - radius * 2) + radius;
            placed = true;
            // Collision detection
            for (let i = 0; i < filledArea.length; i++) {
                let other = filledArea[i];
                let distance = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
                if (distance < (other.radius + radius)) {
                    placed = false;
                    break;
                }
            }
            if (placed) {
                filledArea.push({ x, y, radius });
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = getForestColor();
                ctx.fill();
                ctx.closePath();
            }
            attempts++;
        }
    });
}

const fileSizes = getFileSizes(directoryPath);

// Create the animation by growing the circles over each frame
for (let i = 0; i < frameCount; i++) {
    const scaleFactor = (i + 1) / frameCount; // Gradually increase size over frames
    drawCircles(fileSizes, scaleFactor);
    encoder.addFrame(ctx);
}

encoder.finish();
console.log('The smooth and long animated 4K forest-themed GIF has been created.');
