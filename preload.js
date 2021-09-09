const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, arg) => {
            ipcRenderer.send(channel, arg);
        },
        on: (channel, callback) => {
            ipcRenderer.on(channel, (e, arg) => callback(e, arg));
        }
    }
);