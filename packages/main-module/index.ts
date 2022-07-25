import { Mitt } from "@rush/main-tool/mitt"
import { initMenu } from "./menu"
import { initBackupJob } from "./schedule"
import { initGlobalLog } from "./log"
import { init as initShortcut } from "./shortcut"
import "./filechange"

import { protocol, app } from "electron"
import path from "path"
import fs from "fs"
import { mainConfig } from "@rush/main-config"

export function init(oldMainConfig?: TConfig) {
    initShortcut(oldMainConfig)
    initGlobalLog(oldMainConfig)
    initMenu(oldMainConfig)
    initBackupJob(oldMainConfig)
    // protocol.registerFileProtocol("rush", function (request, callback) {
    //     console.log(request);
    //     // callback({ path: path.normalize(__dirname + "/" + url) })
    // })
    // 文件协议
    // https://vastiny.com/post/tech/electron-protocol
    protocol.unregisterProtocol("rush-file")
    protocol.registerFileProtocol(
        "rush-file",
        (request, callback) => {
            const url = request.url.slice(12)
            callback(path.resolve(mainConfig.storagePath, "./file", url))
        }
    )
}

export function watch() {
    Mitt.off("config-changed")
    Mitt.on("config-changed", (oldMainConfig?: TConfig) => {
        init(oldMainConfig)
    })
}
