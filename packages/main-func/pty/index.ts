import { broadcast } from "@rush/main-tool"
import { ipcMain, webContents } from "electron"
import * as pty from "node-pty"
import os from "os"
import { mainConfig } from "@rush/main-config"

// var shell = os.platform() === "win32" ? "powershell.exe" : "bash"
var shell = os.platform() === "win32" ? "cmd.exe" : "zsh"

let term: pty.IPty
const historyData = {}

export function init() {
    if(term != undefined) {
        setTimeout(() => {
            broadcast("terminal-incomingData-" + term.pid, historyData[term.pid])
        }, 20);
        return term.pid
    }
    term = pty.spawn(shell, ['--login'], {
        name: "xterm-color",
        cwd: mainConfig.storagePath,
        env: process.env,
    })
    // console.log(process.env.PWD);

    let pid = term.pid
    historyData[term.pid] = ""

    const channels = [
        "terminal-incomingData-" + pid,
        "terminal-keystroke-" + pid,
        "terminal-resize-" + pid,
        "terminal-close-" + pid,
    ]
    // 命令反馈
    term.onData(function (data) {
        historyData[pid] += data
        broadcast(channels[0], data)
    })
    // 命令输入
    ipcMain.on(channels[1], (event, key) => {
        term.write(key)
    })
    // 尺寸调整
    ipcMain.on(channels[2], (event, cols, rows) => {
        term.resize(cols, rows)
    })
    // 终端关闭
    ipcMain.on(channels[3], event => {
        console.log("kill "+ pid);
        delete historyData[pid]
        term.kill()
        term = undefined
        // @ts-ignore
        ipcMain.removeAllListeners([channels[1], channels[2], channels[3]])
        pid = -1
    })
    return pid
}
