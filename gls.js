const fs = require('fs');
const { createCanvas } = require('canvas');

const directoryPath = '.'; // Current directory
const canvasSize = 1200;
const canvas = createCanvas(canvasSize, canvasSize);
const ctx = canvas.getContext('2d');
const colors = ['#FFC0CB', '#FFDAB9', '#FFE4E1', '#FFF0F5', '#FAEBD7', '#E6E6FA']; // Soft, warm palette

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

    fileSizes.forEach((file, index) => {
        const radius = Math.sqrt(file.size) / 10; // Arbitrary size scaling
        if (offsetX + radius * 2 > canvasSize) { // Move to next row if width exceeded
            offsetX = 0;
            offsetY += maxHeightInRow + radius; // Start at the end of the tallest circle in the previous row
            maxHeightInRow = 0;
        }
        if (radius * 2 > maxHeightInRow) {
            maxHeightInRow = radius * 2;
        }
        const color = colors[index % colors.length];
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

const out = fs.createWriteStream('files_visualization.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('The PNG file was created.'));
