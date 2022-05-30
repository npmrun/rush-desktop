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
        [propName: string]: any
    },
    store: Store,
    sender: {
        [props: string]: WebContents
    }
}

const payload: IPayload = {
    data: {
        mainWindow: null, // 主窗口
        floatWindow: null, // 浮动窗口
        aboutWindow: null, // 关于窗口
        trayWindow: null,
        forceClose: false,
        lastChoice: -1, // 做过的选择
    },
    store: null,
    sender: {}
}

export default payload
