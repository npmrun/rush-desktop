import { BrowserWindow, Tray, WebContents } from "electron"
import type Store from "electron-store"

interface IPayload {
    data: {
        mainWindow: BrowserWindow | null
        floatWindow: BrowserWindow | null
        aboutWindow: BrowserWindow | null
        trayWindow: Tray | null
        forceClose: boolean
        lastChoice: number
        get focusWindow(): BrowserWindow | null
        [propName: string]: any
    }
    store: Store
    sender: {
        [props: string]: WebContents
    }
}

const Shared: IPayload = {
    data: {
        mainWindow: null, // 主窗口
        floatWindow: null, // 浮动窗口
        aboutWindow: null, // 关于窗口
        trayWindow: null,
        forceClose: false,
        lastChoice: -1, // 做过的选择
        get focusWindow() {
            if (Shared.data.mainWindow && Shared.data.mainWindow.isFocused) {
                return Shared.data.mainWindow
            }
            if (Shared.data.aboutWindow && Shared.data.aboutWindow.isFocused) {
                return Shared.data.aboutWindow
            }
            return null
        },
    },
    store: null,
    sender: {},
}

export { Shared }
