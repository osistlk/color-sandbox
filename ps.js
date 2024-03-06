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

const startMeasure = cpuAverage();

setTimeout(function () {
    const endMeasure = cpuAverage();

    const idleDifference = endMeasure.idle - startMeasure.idle;
    const totalDifference = endMeasure.total - startMeasure.total;

    const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

    console.log(`CPU Usage: ${percentageCPU}%`);
}, 100);
