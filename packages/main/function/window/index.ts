import { app, BrowserWindow, dialog, ipcMain } from "electron"
import Shared from "@/share"
import { setupTray } from "./tray"
export * as about from "./about"
export * as main from "./main"
export * as tray from "./tray"

let canQuit = true
let canQuitTitle = 'Information'
let canQuitMessage = '界面未保存，确认退出吗？'
export function registerQuit(quit: boolean,title:string,message: string) {
    canQuit = quit
    canQuitTitle = title
    canQuitMessage = message
}

export function unRegisterQuit() {
    canQuit = true
    canQuitTitle = 'Information'
    canQuitMessage = '界面未保存，确认退出吗？'
}

export function quit(event?: any, nowQuit?: boolean) {
    // 最小化到磁盘
    function toTray() {
        setupTray()
        Shared.data.lastChoice = 1
        event&&event.preventDefault()
    }
    // 强制退出
    function justQuit() {
        Shared.data.lastChoice = 2
        Shared.data.mainWindow = null
        // app.quit()
        // 不要用quit();试了会弹两次
        Shared.data.forceClose = true
        app.quit() // exit()直接关闭客户端，不会执行quit();
    }

    if(nowQuit){
        justQuit()
        return
    }

    if(!canQuit && Shared.data.mainWindow){
        let choice = dialog.showMessageBoxSync(Shared.data.mainWindow, {
            type: "info",
            title: canQuitTitle,
            defaultId: 0,
            cancelId: 0,
            message: canQuitMessage,
            buttons: ["没事", "退出"],
        })
        Shared.data.lastChoice = choice
    }

    if (Shared.data.forceClose) {
        Shared.data.mainWindow = null
        app.quit()
    } else if (Shared.data.mainWindow) {
        let choice = -1
        if (Shared.data.lastChoice >= 0) {
            choice = Shared.data.lastChoice
        } else {
            choice = dialog.showMessageBoxSync(Shared.data.mainWindow, {
                type: "info",
                title: "Information",
                defaultId: 0,
                cancelId: 0,
                message: "确定要关闭吗？",
                buttons: ["没事", "最小化到磁盘", "直接退出"],
            })
        }
        if (choice === 1) {
            toTray()
        } else if (choice === 2) {
            justQuit()
        } else {
            event&&event.preventDefault()
        }
    }
}