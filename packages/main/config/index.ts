import path from 'path'
import { app } from 'electron'
import fs from 'fs-extra'
import Shared from '@/share'

// 判断是否是空文件夹
function isEmptyDir(fPath: string) {
    var pa = fs.readdirSync(fPath)
    if (pa.length === 0) {
        return true
    } else {
        return false
    }
}

declare const __extra: string
export const appIconPath =  path.join(__extra, '/icons/180x180.png')

let storagePath = path.join(app.getPath('documents'), 'gofast')
export let mainConfig: TConfig = {
    language: 'zh',
    backup_rule: "0 0/30 * * * ?",
    get storagePath() {
        return storagePath
    },
    set storagePath(p: string) {
        // 存在文件夹的话会使用存在的文件夹的配置
        // 不存在文件夹的话会把当前配置文件夹迁移过去
        if (fs.existsSync(storagePath) && !fs.existsSync(p)) {
            fs.moveSync(storagePath, p)
        }
        if (fs.existsSync(p) && fs.existsSync(storagePath) && isEmptyDir(p)) {
            console.log('文件夹为空，直接覆盖')
            fs.moveSync(storagePath, p, { overwrite: true })
        }
        storagePath = p
        Shared.store?.set('appStorePathKey', storagePath)
    },
}
export const PathMgr = {
    get configPath(): string {
        return path.join(
            mainConfig.storagePath,
            './db/_config.json'
        )
    },
}
