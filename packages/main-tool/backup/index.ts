/**
 * 备份代码片段数据，规则如下：
 * 1. 备份文件名称格式为：note_backup_YYYY-MM-DD_HH-MM-SS.zip
 * 2. 备份文件存储在backup/note目录下
 * 3. 备份文件中存储的是所有的代码片段数据
 * 4. 每间隔5分钟备份一次，如果备份文件超过6个，则删除最早的一个
 * 5. 如果文件未修改，则不备份
 */

import compressing from "compressing"
import path from "path"
import fs from "fs-extra"

//格式化data时间
function timeStamp2String(time: number): string {
    var datetime = new Date()
    datetime.setTime(time)
    var year = datetime.getFullYear()
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate()
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours()
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes()
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds()
    return year + "-" + month + "-" + date + "_" + hour + "-" + minute + "-" + second
}

export async function backup(storagePath) {
    const backupDir = path.resolve(storagePath, "backup/note")
    const sourceDir = path.resolve(storagePath, "db/note")
    try {
        const t = path.resolve(backupDir, `note_backup_${timeStamp2String(new Date().getTime())}.zip`)
        if (fs.existsSync(sourceDir) && !fs.existsSync(t)) {
            fs.ensureDirSync(backupDir)
            let files = fs.readdirSync(backupDir)
            if (files.length >= 10) {
                console.log("remove " + files[0])
                fs.removeSync(path.resolve(backupDir, files[0]))
            }
            console.log("backuping...")
            await compressing.zip.compressDir(sourceDir, t)
            console.log(`backup success`)
        }
    } catch (error) {
        throw error
    }
}
