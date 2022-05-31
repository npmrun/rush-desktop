import { init, watch } from "@/modules"
import Store from "electron-store"
import { app, dialog } from "electron"
import fs from "fs-extra"
import path from "path"
import { readConfig, walkConfig } from "./config/util"
import Shared from "@/share"

// sotre
Store.initRenderer()
Shared.store = new Store()

// config
const storePath = Shared.store?.get("appStorePathKey") as string

if (storePath) {
    console.log("地址：", app.getPath("userData"))
    console.log("存储地址：", storePath)
    if (!fs.existsSync(storePath)) {
        dialog.showErrorBox("程序出错", "配置文件夹不存在,将采用默认配置")
        app.on("ready", () => {
            init()
            watch()
        })
    } else {
        app.on("ready", () => {
            const configPath = path.join(storePath, "./db/_config.json")
            fs.ensureFileSync(configPath)
            const config = fs.readJSONSync(configPath, { throws: false }) ?? ({} as TConfig)
            config.storagePath = storePath
            walkConfig(config)
            console.log("读取配置文件成功，当前配置为:")
            console.log(JSON.stringify(readConfig(), null, 2))
            init()
            watch()
        })
    }
} else {
    app.on("ready", () => {
        init()
        watch()
    })
}
