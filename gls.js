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
    // Shuffle and sort by size, largest first
    return fileStats
        .sort(() => 0.5 - Math.random())
        .sort((a, b) => b.size - a.size);
}

// Function to draw non-overlapping circles based on file sizes
function drawCircles(fileSizes) {
    // Sort files by size
    const sortedFiles = fileSizes.sort((a, b) => b.size - a.size);
    // Calculate total area and assign area to each file relative to its size
    const totalSize = sortedFiles.reduce((acc, file) => acc + file.size, 0);
    let filledArea = []; // Initialize filledArea as an array

    // Place circles using calculated radius
    sortedFiles.forEach(file => {
        let targetArea = (file.size / totalSize) * (canvasSize * canvasSize);
        let radius = Math.sqrt(targetArea / Math.PI);

        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 1000) {
            let x = Math.random() * (canvasSize - radius * 2) + radius;
            let y = Math.random() * (canvasSize - radius * 2) + radius;
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
                ctx.fillStyle = getRandomColor();
                ctx.fill();
                ctx.closePath();
            }
            attempts++;
        }
    });
}

const fileSizes = getFileSizes(directoryPath);
drawCircles(fileSizes);

const out = fs.createWriteStream('files_visualization.jpg');
const stream = canvas.createJPEGStream({ quality: 1 }); // 100% quality JPEG
stream.pipe(out);
out.on('finish', () => console.log('The JPEG file was created.'));
