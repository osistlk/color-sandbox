const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 400;
const height = 400;
const transitionSteps = 100; // Number of steps to complete the transition

// Initialize GIFEncoder
const encoder = new GIFEncoder(width, height);
encoder.start();
encoder.setRepeat(0); // Looping: 0 for infinite loop
encoder.setDelay(20); // Delay between frames in milliseconds
encoder.setQuality(10); // Image quality, 1-20

// Create a canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Function to lerp (linear interpolation) between two values
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

// Function to generate a frame at a specific step in the transition
function generateFrame(step) {
    // Create an imageData object to manipulate pixels
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;

    // Loop through all pixels
    for (let i = 0; i < data.length; i += 4) {
        // Randomly decide whether to update this pixel based on the current step
        if (Math.random() < (step / transitionSteps)) {
            // Transition from blue to yellow
            data[i] = lerp(0, 255, step / transitionSteps);     // R
            data[i + 1] = lerp(0, 255, step / transitionSteps); // G
            data[i + 2] = lerp(255, 0, step / transitionSteps); // B
        }
    }

    // Put the modified pixels back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Add the canvas to the GIF as the next frame
    encoder.addFrame(ctx);
}

// Generate each frame of the transition
for (let i = 0; i <= transitionSteps; i++) {
    generateFrame(i);
}

// Finalize the GIF and save it
encoder.finish();
fs.writeFileSync('transitionEffect.gif', encoder.out.getData());

console.log('Transition effect GIF created successfully!');
