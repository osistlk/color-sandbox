const fs = require('fs');
const { createCanvas } = require('canvas');

const directoryPath = '.'; // Current directory
const canvasSize = 1200;
const canvas = createCanvas(canvasSize, canvasSize);
const ctx = canvas.getContext('2d');

// Soft, warm palette generator
function getRandomColor() {
    const h = Math.floor(Math.random() * 35); // Hue between 0 and 35 for a warm palette
    const s = Math.floor(Math.random() * 40) + 60; // Saturation between 60% and 100%
    const l = Math.floor(Math.random() * 20) + 70; // Lightness between 70% and 90%
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Function to get file sizes from the current directory
function getFileSizes(dirPath) {
    const fileStats = fs.readdirSync(dirPath).map(fileName => {
        const stats = fs.statSync(`${dirPath}/${fileName}`);
        return { fileName, size: stats.size };
    });
    // Sort by size, largest first
    return fileStats.sort((a, b) => b.size - a.size);
}

// Function to draw non-overlapping circles based on file sizes
function drawCircles(fileSizes) {
    let offsetX = 0;
    let offsetY = 0;
    let maxHeightInRow = 0;

    fileSizes.forEach((file) => {
        const radius = Math.sqrt(file.size) / 100; // Arbitrary size scaling, adjust as needed
        if (offsetX + radius * 2 > canvasSize) { // Move to next row if width exceeded
            offsetX = 0;
            offsetY += maxHeightInRow + radius; // Start at the end of the tallest circle in the previous row
            maxHeightInRow = 0;
        }
        if (radius * 2 > maxHeightInRow) {
            maxHeightInRow = radius * 2;
        }
        const color = getRandomColor();
        ctx.beginPath();
        ctx.arc(offsetX + radius, offsetY + radius, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        offsetX += radius * 2; // Move offset for the next circle
    });
}

const fileSizes = getFileSizes(directoryPath);
drawCircles(fileSizes);

const out = fs.createWriteStream('files_visualization.jpg');
const stream = canvas.createJPEGStream({ quality: 1 }); // 100% quality JPEG
stream.pipe(out);
out.on('finish', () => console.log('The JPEG file was created.'));
