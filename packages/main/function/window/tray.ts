import Shared from "@/share"
import path from "path"
import { app, Menu, Tray } from "electron"
import { hideMainWindow, showMainWindow } from "./main"
import { appTrayPath } from "@rush-desktop/main-tool"

let textHolder = {
    openWindow: "打开窗口",
    openFloat: "打开悬浮时钟",
    exitTray: "退出托盘",
    quit: "退出",
}

function setupTrayMenu() {
    // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
    // 通常被添加到一个 context menu 上.
    // 系统托盘右键菜单
    const trayMenuTemplate = [
        {
            // 系统托盘图标目录
            label: textHolder.openWindow,
            click: () => {
                showMainWindow()
            },
        },
        {
            // 系统托盘图标目录
            label: textHolder.openFloat,
            click: () => {},
        },
        {
            // 系统托盘图标目录
            label: textHolder.exitTray,
            click: () => {
                if (Shared.data.trayWindow) {
                    Shared.data.trayWindow.destroy()
                    if (Shared.data.trayWindow.isDestroyed()) {
                        Shared.data.trayWindow = null
                        showMainWindow()
                        Shared.data.lastChoice = -1
                    }
                }
            },
        },
        {
            // 系统托盘图标目录
            label: textHolder.quit,
            click: () => {
                Shared.data.forceClose = true
                app.quit()
            },
        },
    ]
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

    // 设置托盘菜单
    Shared.data.trayWindow?.setContextMenu(contextMenu)
}

// 隐藏主窗口，并创建托盘，绑定关闭事件
export function setupTray(isHide: boolean = true) {
    if (Shared.data.trayWindow && isHide) {
        hideMainWindow()
        return
    }
    // 设置系统托盘图标
    let iconPath = ""
    if (process.platform == "darwin") {
        iconPath = appTrayPath
    }
    if (process.platform == "win32") {
        iconPath = appTrayPath
    }
    if (process.platform == "linux") {
        iconPath = appTrayPath
    }

    Shared.data.trayWindow = new Tray(iconPath)
    setupTrayMenu()
    if (isHide) {
        // 展示主窗口，隐藏主窗口 mainWindow.hide()
        hideMainWindow()
    }

    // 设置托盘悬浮提示
    Shared.data.trayWindow.setToolTip("never forget")

    // 单击托盘小图标显示应用
    Shared.data.trayWindow.on("double-click", () => {
        // 显示主程序
        showMainWindow()
    })
    return Shared.data.trayWindow
}
