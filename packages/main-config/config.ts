import fs from "fs-extra"
import { app } from "electron"
import path from "path"
import { Mitt } from "@rush/main-tool/mitt"
import setting from "@rush/share/setting"
import { cloneDeep } from "lodash"

interface IConfig {
    language: "zh" | "en"
    backup_rule: string
    storagePath: string
}

// 判断是否是空文件夹
function isEmptyDir(fPath: string) {
    var pa = fs.readdirSync(fPath)
    if (pa.length === 0) {
        return true
    } else {
        return false
    }
}

class Settings {
    private static instance: Settings = null
    private constructor() {
        this.#init()
    }
    static init() {
        if (Settings.instance === null) {
            Settings.instance = new Settings()
        }
    }
    static get n() {
        return Settings.instance
    }
    #pathFile: string = path.resolve(app.getPath("userData"), "./config_path")
    #config: IConfig = {
        language: "zh",
        backup_rule: "0 0/30 * * * ?",
        storagePath: path.join(app.getPath("documents"), setting.app_title),
    }
    #configPath(storagePath?: string): string {
        return path.join(storagePath || this.#config.storagePath, "./config.json")
    }

    #init() {
        console.log(`位置：${this.#pathFile}`)
        if (fs.pathExistsSync(this.#pathFile)) {
            const confingPath = fs.readFileSync(this.#pathFile, { encoding: "utf8" })
            if (confingPath && fs.pathExistsSync(this.#configPath(confingPath))) {
                const config = fs.readJSONSync(this.#configPath(confingPath)) as IConfig
                config.storagePath = confingPath
                Object.assign(this.#config, config)
            }
        }
    }
    config() {
        return this.#config
    }
    #sync() {
        const config = cloneDeep(this.#config)
        delete config.storagePath
        fs.writeJSONSync(this.#configPath(), config)
    }
    #change(p: string) {
        const storagePath = this.#config.storagePath
        if (fs.existsSync(storagePath) && !fs.existsSync(p)) {
            fs.moveSync(storagePath, p)
        }
        if (fs.existsSync(p) && fs.existsSync(storagePath) && isEmptyDir(p)) {
            console.log("文件夹为空，直接覆盖")
            fs.moveSync(storagePath, p, { overwrite: true })
        }
        fs.writeFileSync(this.#pathFile, p, { encoding: "utf8" })
    }
    set(key: keyof IConfig | Partial<IConfig>, value?: any) {
        let oldMainConfig = Object.assign({}, this.#config)
        let isChange = false
        if (typeof key === "string") {
            if (value != undefined && value !== this.#config[key]) {
                if (key === "storagePath") {
                    this.#change(value)
                    this.#config["storagePath"] = value
                } else {
                    this.#config[key] = value
                }
                isChange = true
            }
        } else {
            for (const _ in key) {
                if (Object.prototype.hasOwnProperty.call(key, _)) {
                    const v = key[_]
                    if (v != undefined && v !== this.#config[_]) {
                        if (_ === "storagePath" && v !== undefined) {
                            this.#change(v)
                        }
                        this.#config[_] = v
                        isChange = true
                    }
                }
            }
        }
        if (isChange) {
            this.#sync()
            Mitt.emit("config-changed", oldMainConfig)
        }
    }
    values(key: keyof IConfig) {
        return this.#config[key]
    }
}

export { Settings }
