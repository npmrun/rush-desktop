import { BrowserWindow } from "electron"
import { Shared } from "@rush/main-share"
import { getFileUrl } from "@rush/main-tool"
import { appIconPath } from "@rush/main-tool"

export function showAboutWindow() {
    if (Shared.data.aboutWindow) {
        Shared.data.aboutWindow.focus()
        return
    }
    let aboutWindow: BrowserWindow = new BrowserWindow({
        width: 600,
        height: 200,
        minimizable: false,
        darkTheme: true,
        modal: true,
        show: false,
        resizable: false,
        icon: appIconPath,
        // parent: Shared.data.mainWindow as BrowserWindow,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        parent: Shared.data.focusWindow // win是主窗口
    })
    // 隐藏菜单
    aboutWindow.setMenuBarVisibility(false)
    // vue是单页面，需要改成多页面才行

    // Shared.data.aboutWindow.loadURL(getFileUrl("about"))
    aboutWindow.loadURL(getFileUrl("about.html"))
    aboutWindow.on("ready-to-show", () => {
        aboutWindow?.show()
    })
    aboutWindow.on("close", () => {
        aboutWindow.destroy()
        Shared.data.aboutWindow = null
    })
    Shared.data.aboutWindow = aboutWindow
}