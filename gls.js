const fs = require("fs");
const { createCanvas } = require("canvas");
const ProgressBar = require("progress"); // Import progress

const directoryPath = process.argv[2] || "."; // Use path from args or default to current directory
const canvasWidth = 3840; // 4K Width
const canvasHeight = 2160; // 4K Height
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext("2d");

// Set a dark green background
ctx.fillStyle = "#013220"; // Dark green, like a forest floor
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// Lush green palette generator
function getLushGreenColor() {
  const h = Math.floor(Math.random() * (120 - 85) + 85); // Hue for green shades
  const s = Math.floor(Math.random() * (100 - 50) + 50); // Saturation for rich color
  const l = Math.floor(Math.random() * (60 - 30) + 30); // Lightness for depth
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Function to get file sizes from the current directory
function getFileSizes(dirPath) {
  const fileStats = fs.readdirSync(dirPath).map((fileName) => {
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
  let filledArea = []; // Initialize filledArea as an array

  // Create a new progress bar instance
  const bar = new ProgressBar(":bar :percent", { total: sortedFiles.length });

  // Place circles using calculated radius
  sortedFiles.forEach((file) => {
    let targetArea =
      (file.size / fileSizes.reduce((a, b) => a + b.size, 0)) *
      (canvasWidth * canvasHeight);
    let radius = Math.sqrt(targetArea / Math.PI);

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
        if (distance < other.radius + radius) {
          placed = false;
          break;
        }
      }
      if (placed) {
        filledArea.push({ x, y, radius });
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getLushGreenColor();
        ctx.fill();
        ctx.closePath();
      }
      attempts++;
    }

    // Update the progress bar
    bar.tick();
  });
}

const fileSizes = getFileSizes(directoryPath);
drawCircles(fileSizes);

const out = fs.createWriteStream("files_visualization_forest_4k.jpg");
const stream = canvas.createJPEGStream({ quality: 1 }); // 100% quality JPEG
stream.pipe(out);
out.on("finish", () =>
  console.log("The 4K forest-themed JPEG file was created."),
);
