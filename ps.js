const os = require('os');

function cpuAverage() {
    const cpus = os.cpus();

    let totalIdle = 0, totalTick = 0;
    for (let i = 0, len = cpus.length; i < len; i++) {
        const cpu = cpus[i];

        for (type in cpu.times) {
            totalTick += cpu.times[type];
        }

        totalIdle += cpu.times.idle;
    }

    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function generateBarChart(percentages) {
    const chart = Array(10).fill().map(() => Array(20).fill(' ')); // create a 10x20 2D array filled with spaces

    for (let i = 0; i < percentages.length; i++) {
        const height = Math.round(percentages[i] / 10); // scale down to 10 characters tall
        for (let j = 0; j < height; j++) {
            chart[9 - j][i] = '='; // fill from the bottom up
        }
    }

    return chart.map(row => row.join('')).join('\n'); // convert the 2D array to a string
}

let cpuPercentages = [];

setInterval(function () {
    const startMeasure = cpuAverage();

    setTimeout(function () {
        const endMeasure = cpuAverage();

        const idleDifference = endMeasure.idle - startMeasure.idle;
        const totalDifference = endMeasure.total - startMeasure.total;

        const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

        cpuPercentages.push(percentageCPU);
        if (cpuPercentages.length > 20) { // keep the last 20 measurements
            cpuPercentages.shift();
        }

        const averageCPU = cpuPercentages.reduce((a, b) => a + b, 0) / cpuPercentages.length;

        console.clear();
        console.log(`CPU Usage: ${percentageCPU}%`);
        console.log(`Average CPU Usage: ${averageCPU.toFixed(2)}%`);
        console.log(`Bar Chart:\n${generateBarChart(cpuPercentages)}`);
    }, 100);
}, 1000);
