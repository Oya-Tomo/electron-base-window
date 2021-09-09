const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");

const isSingleApp = app.requestSingleInstanceLock();

if (!isSingleApp) {
    app.quit();
}

// global variables
const WINDOW_WIDTH_KEY = "window-width";
const WINDOW_HEIGHT_KEY = "window-height";
const WINDOW_ISMAX_KEY = "window_ismax";

let mainWindow = null;
const store = new Store();


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.once("ready", () => {
    var width = store.get(WINDOW_WIDTH_KEY) || 800;
    var height = store.get(WINDOW_HEIGHT_KEY) || 600;
    var isMax = store.get(WINDOW_ISMAX_KEY) || false;

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: 700,
        minHeight: 500,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: __dirname + "/preload.js"
        }
    });

    if (isMax) {
        mainWindow.maximize();
    }

    mainWindow.loadURL("file://" + __dirname + "/main.html");

    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.show();
    });

    

    mainWindow.on("resize", () => {
        isMax = mainWindow.isMaximized();
        if (isMax) {
            store.set(WINDOW_ISMAX_KEY, true);
        } else {
            const size = mainWindow.getSize();
            store.set(WINDOW_WIDTH_KEY, size[0]);
            store.set(WINDOW_HEIGHT_KEY, size[1]);
            store.set(WINDOW_ISMAX_KEY, false);
        }
        mainWindow.webContents.send("getResize", isMax);
    });

    mainWindow.on('close', () => {
        mainWindow = null;
    });
});

ipcMain.on("quit", (e, arg) => {
    app.quit();
});

ipcMain.on("resize", (e, arg) => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

ipcMain.on("mini", (e, arg) => {
    mainWindow.minimize();
});

ipcMain.on("getResize", (e, arg) => {
    e.sender.send("getResize", mainWindow.isMaximized());
});