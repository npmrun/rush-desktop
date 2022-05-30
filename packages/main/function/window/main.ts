import { app, BrowserWindow, dialog, ipcMain } from "electron"
import Shared from "@/share"
import { getFileUrl } from "@rush-desktop/main-tool"
import { quit } from "."
import { appIconPath } from "@rush-desktop/main-tool"

export function hideMainWindow() {
    if (!Shared.data.mainWindow || Shared.data.mainWindow?.isDestroyed()) {
        return
    }
    Shared.data.mainWindow.hide()
}

export function showMainWindow(opts = {}) {
    if (!Shared.data.mainWindow || Shared.data.mainWindow?.isDestroyed()) {
        /**
         * Initial window options
         */
        Shared.data.mainWindow = new BrowserWindow({
            height: 600,
            useContentSize: true,
            width: 800,
            show: true,
            resizable: true,
            minWidth: 800,
            minHeight: 600,
            icon: appIconPath,
            frame: true, // 去除原生的菜单
            transparent: false, // 背景透明, 会导致窗体没有阴影
            alwaysOnTop: false,
            webPreferences: {
                webviewTag: false,
                nodeIntegration: true,
                contextIsolation: true,
                preload: __resource + "/preload.js", // 预加载项
            },
            ...opts,
        })
        Shared.data.mainWindow.loadURL(getFileUrl("index.html"))
        Shared.data.mainWindow.on("close", (event: any) => {
            quit(event)
        })
    } else {
        Shared.data.mainWindow?.show()
        // Shared.data.mainWindow?.showInactive()
    }
}