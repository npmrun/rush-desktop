import { Mitt } from "@/core/mitt"
import { initMenu } from "./menu"
import { initBackupJob } from "./schedule"

export function init(oldMainConfig?: TConfig) {
    initMenu(oldMainConfig)
    initBackupJob(oldMainConfig)
}

export function watch() {
    Mitt.off("config-changed")
    Mitt.on("config-changed", (oldMainConfig?: TConfig) => {
        init(oldMainConfig)
    })
}
