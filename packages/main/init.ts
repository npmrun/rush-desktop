import { init, watch } from "@rush/main-module"
import Store from "electron-store"
import { app, dialog, crashReporter, shell } from "electron"
import fs from "fs-extra"
import path from "path"
import { mainConfig, readConfig, walkConfig } from "@rush/main-config"
import { Shared } from "@rush/main-share"
import processManager from "@rush/main-tool/process"
import { Mitt } from "@rush/main-tool/mitt"
// import { Settings } from "@rush/main-config/config"

Mitt.on('app-message', ()=>{
    // 处理全局消息, 可以自行处理以及发送到前端处理
})

crashReporter.start({
    uploadToServer: false,
})

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

/**
 * a标签使用默认程序打开
 * https://blog.csdn.net/qq_33583069/article/details/108056729
 */
app.on('web-contents-created', (e, webContents) => {
    webContents.addListener('new-window', (event, urla) => {
        event.preventDefault();
        console.log(urla);
        let url = urla.slice(12)
        const index = url.indexOf("?")
        if(index != -1){
            url = url.slice(0, index)
        }
        const p = path.resolve(mainConfig.storagePath, "./file", url)
        console.log(p);
        shell.openExternal(p);
    });
});

process

    // Handle normal exits
    .on("exit", code => {
        processManager.killAll()
        process.exit(code)
    })

    // Handle CTRL+C
    .on("SIGINT", () => {
        processManager.killAll()
        process.exit(0)
    })
