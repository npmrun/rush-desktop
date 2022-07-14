import { validateCron } from "@rush/common/util"
import { backup } from "@rush/main-tool/backup"
import { mainConfig } from "@rush/main-config"
import schedule, { Job } from "node-schedule"
// import watcher, { AsyncSubscription } from "@parcel/watcher"
import path from "path"

let job: Job | null = null
// let wat: AsyncSubscription | null = null
// TODO 比对文件是否有变化，如果没有变化，则不备份
let canBackup = false

export function setCanBackup() {
    canBackup = true
}

export async function initBackupJob(oldMainConfig?: TConfig) {
    if (!validateCron(mainConfig.backup_rule)) {
        console.error("无效Cron表达式")
        return
    }
    if (job && mainConfig.backup_rule != oldMainConfig?.backup_rule) {
        job.reschedule(mainConfig.backup_rule)
        console.error("定时备份任务重新运行")
    } else if (job == null) {
        console.error("定时备份任务初始化成功")
        job = schedule.scheduleJob(mainConfig.backup_rule, async function () {
            console.log("备份测试");
            // if (canBackup) {
            //     await backup(mainConfig.storagePath)
            //     canBackup = false
            // } else {
            //     console.log("该文件没有过更新，暂不备份")
            // }
        })
    }
}
