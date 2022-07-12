import { Mitt } from "@rush-desktop/main-tool/mitt"
import { initMenu } from "./menu"
import { initBackupJob } from "./schedule"
import "./filechange"

import { protocol, app } from "electron"
import path from "path"
import fs from "fs"

export function init(oldMainConfig?: TConfig) {
    initMenu(oldMainConfig)
    initBackupJob(oldMainConfig)

    // protocol.registerFileProtocol("rush", function (request, callback) {
    //     console.log(request);
    //     // callback({ path: path.normalize(__dirname + "/" + url) })
    // })
    // 文件协议
    // https://vastiny.com/post/tech/electron-protocol
    protocol.registerFileProtocol(
        "rush-file",
        (request, callback) => {
            console.log(request);
            const url = request.url.slice(11)
            // callback({ path: path.normalize(`'C:\\Users\\15494\\Pictures\\bg.jpg'`) })
            callback('C:\\Users\\15494\\Pictures\\bg.jpg')
        }
    )
}

export function watch() {
    Mitt.off("config-changed")
    Mitt.on("config-changed", (oldMainConfig?: TConfig) => {
        init(oldMainConfig)
    })
}
