import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"
import { callMethod, callMethodLong, callMethodSync } from "./call"
import path from "path"
import * as file from "./file"
import { platform } from "@rush/common"

let preloadPath = path.join(__dirname, "preload.js")
let iframePath = `http://localhost:${process.env.PORT}/iframe.html`
let extraPath = path.join(__dirname, "../../extra")
if (__dirname.split(path.sep).indexOf("app.asar") >= 0) {
    preloadPath = path.join(__dirname, "preload.js")
    iframePath = path.join(__dirname, "iframe.html")
    extraPath = path.join(__dirname, "../..")
}

const _agent = {
    info: {
        platform: platform,
        chrome: process.versions["chrome"],
        node: process.versions["node"],
        electron: process.versions["electron"],
    },
    preloadPath: preloadPath,
    iframePath: iframePath,
    extraPath: extraPath,
    file: file,
    call: callMethod,
    callLong: callMethodLong,
    callSync: callMethodSync,
    send(command: string, ...argu: any[]) {
        return ipcRenderer.send(command, ...argu)
    },
    sendSync(command: string, ...argu: any[]) {
        return ipcRenderer.sendSync(command, ...argu)
    },
    on(command: string, cb: (event: IpcRendererEvent, ...args: any[]) => void) {
        ipcRenderer.on(command, cb)
        return () => ipcRenderer.removeListener(command, cb)
    },
    once(command: string, cb: (event: IpcRendererEvent, ...args: any[]) => void) {
        ipcRenderer.once(command, cb)
        return () => ipcRenderer.removeListener(command, cb)
    },
    off(command: string, cb: (event: IpcRendererEvent, ...args: any[]) => void) {
        return ipcRenderer.removeListener(command, cb)
    },
    offAll(command: string) {
        return ipcRenderer.removeAllListeners(command)
    },
    popupMenu(options: IPopupMenuOption) {
        ipcRenderer.send("x_popup_menu", options)
    },
}

contextBridge.exposeInMainWorld("_agent", _agent)
