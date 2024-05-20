const { exec } = require("child_process");

setInterval(() => {
  exec(
    "nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.clear();
      const usage = parseFloat(stdout);
      console.log(`GPU Usage: ${usage}%`);
    },
  );
}, 1000); // update every 5 seconds
