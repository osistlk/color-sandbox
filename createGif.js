const GIFEncoder = require("gifencoder");
const { createCanvas } = require("canvas");

// Configuration for the GIF
const width = 400;
const height = 400;

// Colors for each frame (HEX or RGB)
const colors = [
  "#FF0000", // red
  "#FF7F00", // orange
  "#FFFF00", // yellow
  "#00FF00", // lime
  "#0000FF", // blue
  "#4B0082", // indigo
  "#9400D3", // violet
  "#FFFFFF", // white
  "#000000", // black
  "#CCCCCC", // gray
];

// Create a new GIFEncoder instance
const encoder = new GIFEncoder(width, height);

// Configure the encoder
encoder.start();
encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
encoder.setDelay(500); // frame delay in ms
encoder.setQuality(10); // image quality. 1 - 20

// Create a writable stream to save the GIF

// Create a canvas to draw each frame
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Generate each frame
colors.forEach((color) => {
  ctx.fillStyle = color; // Set the current frame color
  ctx.fillRect(0, 0, width, height); // Draw the solid color
  encoder.addFrame(ctx); // Add the frame to the GIF
});

// Finish encoding and close the stream
encoder.finish();

console.log("GIF created successfully!");
