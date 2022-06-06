import fs from "fs-extra"
import Shared from "@/share"
import { mainConfig, PathMgr } from "./index"
import { Mitt } from "@rush-desktop/main-tool/mitt"

/**
 * 保存配置文件到本地
 * @param config 配置文件JSON
 * @returns Promise<config>
 */
export function saveConfig(config: TConfig) {
    walkConfig(config)
    fs.ensureFileSync(PathMgr.configPath)
    // @ts-ignore
    delete config.storagePath
    fs.writeJSONSync(PathMgr.configPath, config)
}

/**
 * 读取本地文件的JSON
 * @returns Promise<配置文件JSON>
 */
export function readConfig(): TConfig {
    fs.ensureFileSync(PathMgr.configPath)
    fs.readJSONSync(PathMgr.configPath, { throws: false }) as TConfig
    // if (data) {
    //     walkConfig(data)
    // }
    return mainConfig
}

/**
 * 用于覆盖本地变量
 * @param _config 通用配置
 * @param _mainConfig 主进程配置
 */
export function walkConfig(_config: TConfig) {
    let oldMainConfig = Object.assign({}, mainConfig)
    let isChange = false
    ;(Object.keys(_config) as [keyof TConfig]).forEach(key => {
        if (mainConfig[key] != undefined && _config[key] !== mainConfig[key]) {
            // @ts-ignore
            mainConfig[key] = _config[key]
            isChange = true
        }
    })
    if(isChange){
        Mitt.emit("config-changed", oldMainConfig)
    }
}
