const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
        preload: path.join(__dirname, 'preload.js')
    })

    win.loadFile('index.html')
}

app.whenReady().then(createWindow)
