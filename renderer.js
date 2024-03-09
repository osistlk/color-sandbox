const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let time = 0;

function draw() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set drawing color based on theme
    ctx.strokeStyle = prefersDarkMode ? 'white' : 'black';

    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        let y = Math.sin(x * 0.05 + time) * 20 + canvas.height / 2;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    time += 0.05;
    requestAnimationFrame(draw);
}

draw();
