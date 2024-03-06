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

function generateHistogram(percentage) {
    const length = Math.floor(percentage / 2); // scale down for readability
    return Array(length).fill('*').join('');
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
        if (cpuPercentages.length > 100) { // keep the last 100 measurements
            cpuPercentages.shift();
        }

        const averageCPU = cpuPercentages.reduce((a, b) => a + b, 0) / cpuPercentages.length;

        console.clear();
        console.log(`CPU Usage: ${percentageCPU}%`);
        console.log(`Average CPU Usage: ${averageCPU.toFixed(2)}%`);
        console.log(`Histogram:\n${generateHistogram(percentageCPU)}`);
    }, 100);
}, 1000);
