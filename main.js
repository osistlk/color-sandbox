const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const preloadPath = path.join(__dirname, 'preload.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        preload: preloadPath,
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);
