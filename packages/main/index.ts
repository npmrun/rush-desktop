import "./init"

import { isPromise, readCommand } from "@rush-desktop/main-tool"
import { ipcMain, app } from "electron"
import Shared from "@/share"
import { showMainWindow } from "@/function/window/main"
import { setupTray } from "@/function/window/tray"
import { parseCommand } from "./util"
import updater from "@rush-desktop/main-tool/updater"
/**
 * 超级命令,用字符串直接调用方法
 */
ipcMain.addListener("command", (event, key, command: string, ...argus) => {
    try {
        let run = parseCommand(command)
        if (run) {
            let result: Promise<any> | any = run(...argus)
            if (isPromise(result)) {
                result
                    .then((res: any) => {
                        event.reply(key, null, res)
                        event.returnValue = res
                    })
                    .catch((err: Error) => {
                        event.reply(key, err)
                        event.returnValue = null
                    })
            } else {
                event.reply(key, null, result)
                event.returnValue = result
            }
        } else {
            event.reply(key, new Error("不存在该命令"))
            event.returnValue = null
        }
    } catch (error) {
        event.reply(key, error)
        event.returnValue = null
    }
})

function createWindow() {
    // Shared.data.lastChoice = 1
    // setupTray()
    showMainWindow()
    updater(Shared.data.mainWindow)
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.exit()
} else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        if (Shared.data.mainWindow) {
            if (Shared.data.mainWindow.isMinimized()) Shared.data.mainWindow.restore()
            Shared.data.mainWindow.focus()
            Shared.data.mainWindow.show()
        }
    })

    app.on("ready", () => setTimeout(createWindow, 500))

    app.on("before-quit", event => {
        if (Shared.data.forceClose) {
            app.exit()
        } else {
            event.preventDefault()
        }
    })

    app.on("window-all-closed", () => {
        // 可以在这里面清理创建的子进程
        if (process.platform !== "darwin") {
            app.exit()
        }
    })

    app.on("activate", () => {
        if (Shared.data.mainWindow === null) {
            setTimeout(createWindow, 500)
        }
    })
}
