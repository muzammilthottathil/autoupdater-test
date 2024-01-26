import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { autoUpdater } from "electron-updater";
import { log } from "./logger";

autoUpdater.logger = log;
// @ts-ignore
autoUpdater.logger.transports.file.level = "info";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
    serve({ directory: "app" });
} else {
    app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let mainWindow: Electron.BrowserWindow;

(async () => {
    await app.whenReady();

    mainWindow = createWindow("main", {
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (isProd) {
        await mainWindow.loadURL("app://./home");
    } else {
        const port = process.argv[2];
        await mainWindow.loadURL(`http://localhost:${port}/home`);
        mainWindow.webContents.openDevTools();
    }

    autoUpdater.checkForUpdatesAndNotify();
})();

app.on("window-all-closed", () => {
    app.quit();
});

ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
});

ipcMain.handle("app-version", () => app.getVersion());

// Auto Updater Events
autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("auto-updater", "Update Available");
});

autoUpdater.on("download-progress", (progressObj) => {
    let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
    log_message = `${log_message} - Downloaded ${progressObj.percent}%`;
    log_message = `${log_message} (${progressObj.transferred}/${progressObj.total})`;
    mainWindow.webContents.send("auto-updater", log_message);
});
autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("auto-updater", "Update Downloaded");
});
