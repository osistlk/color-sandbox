const fs = require("fs");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const ProgressBar = require("progress");

const directoryPath = "."; // Current directory
const canvasWidth = 2560; // 1080p Width
const canvasHeight = 1440; // 1080p Height
const frameCount = 144; // Total number of frames for the animation
const encoder = new GIFEncoder(canvasWidth, canvasHeight);

// Initialize the progress bar
const bar = new ProgressBar("Generating GIF [:bar] :percent :etas", {
  complete: "=",
  incomplete: " ",
  width: 20,
  total: frameCount,
});

// Stream the encoder's output to a file
encoder
  .createReadStream()
  .pipe(fs.createWriteStream("animated_forest_1080p.gif"));
encoder.start();
encoder.setRepeat(0); // 0 for no repeat
encoder.setDelay(500); // Approximation to target a high frame rate feel
encoder.setQuality(10); // Image quality

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext("2d");

function getForestColor() {
  // Implement the getForestColor function as before.
  return "hsl(" + Math.floor(Math.random() * 360) + ", 50%, 50%)"; // Placeholder
}

function getFileSizes(dirPath) {
  // Implement the getFileSizes function as before.
  return fs
    .readdirSync(dirPath)
    .map((fileName) => {
      const stats = fs.statSync(`${dirPath}/${fileName}`);
      return { fileName, size: stats.size };
    })
    .sort(() => 0.5 - Math.random()); // Shuffle for variation
}

function drawCircles(fileSizes, scaleFactor) {
  ctx.fillStyle = "#013220"; // Dark green background
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  let placedCircles = [];
  const attemptLimit = 100; // Limit attempts to place a circle to prevent infinite loops

  fileSizes.forEach((file) => {
    const baseSize = 10; // Minimum size for visibility
    let radius =
      baseSize +
      (file.size / Math.max(...fileSizes.map((f) => f.size))) *
        100 *
        scaleFactor;

    let placed = false;
    let attempts = 0;
    let x, y; // Declare x and y outside the while loop to ensure they're accessible later

    while (!placed && attempts < attemptLimit) {
      x = radius + Math.random() * (canvasWidth - 2 * radius); // Random position, respecting margins
      y = radius + Math.random() * (canvasHeight - 2 * radius);

      // Check for overlaps
      let overlap = placedCircles.some((circle) => {
        let dx = circle.x - x;
        let dy = circle.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle.radius + radius;
      });

      if (!overlap) {
        placedCircles.push({ x, y, radius });
        placed = true;
      }

      attempts++;
    }

    if (placed) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2); // x and y are now correctly in scope
      ctx.fillStyle = getForestColor();
      ctx.fill();
    }
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
console.log("The animated 1080p forest-themed GIF has been created.");
