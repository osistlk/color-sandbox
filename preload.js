const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nodeProcess", {
  getCpuUsage: () => process.getCPUUsage().percentCPUUsage,
});
