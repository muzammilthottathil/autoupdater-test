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

function formatData(sizeInKB: number, isSpeed: boolean = false): string {
    if (sizeInKB < 0) {
        return "Invalid " + (isSpeed ? "speed" : "size");
    }

    if (sizeInKB < 1024) {
        return sizeInKB.toFixed(2) + " KB" + (isSpeed ? "/s" : "");
    } else if (sizeInKB < 1048576) {
        // 1024 * 1024
        return (sizeInKB / 1024).toFixed(2) + " MB" + (isSpeed ? "/s" : "");
    } else {
        return (sizeInKB / 1048576).toFixed(2) + " GB" + (isSpeed ? "/s" : "");
    }
}

autoUpdater.on("download-progress", (progressObj) => {
    let log_message = `Download speed: ${formatData(progressObj.bytesPerSecond, true)}`;
    log_message = `${log_message} - Downloaded ${Number(progressObj.percent).toFixed(2)}%`;
    log_message = `${log_message} (${formatData(progressObj.transferred)}/${formatData(progressObj.total)})`;
    mainWindow.webContents.send("auto-updater", log_message);
});
autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("auto-updater", "Update Downloaded");
});
