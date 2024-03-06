const os = require('os');
const fs = require('fs');

// CPU Usage
const cpus = os.cpus();
console.log('CPU Info:', cpus);

// Memory Usage
const totalMemory = os.totalmem() / (1024 * 1024 * 1024); // in GB
const freeMemory = os.freemem() / (1024 * 1024 * 1024); // in GB
const usedMemory = totalMemory - freeMemory;
console.log(`Memory Usage: ${usedMemory.toFixed(2)} GB / ${totalMemory.toFixed(2)} GB`);

// Disk Usage
fs.stat('C:\\', function (err, stats) {
    const totalDisk = stats.size / (1024 * 1024 * 1024); // in GB
    console.log(`Total Disk Size: ${totalDisk.toFixed(2)} GB`);
});
