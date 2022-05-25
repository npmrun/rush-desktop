
import { execa } from "@/utils"
import { join } from "path"
import { Debug, Error } from "@/utils/log"
import { ChildProcess } from "child_process"
import config from "@/config"
export default function build() {
    return new Promise<ChildProcess>((resolve, reject) => {
        const viteProcess = execa(
            "node",
            [config.rootViteCMD, "build", "-c", config.rootViteConfig],
            (err: any, data: any, isComplete?: boolean) => {
                if (isComplete) {
                    resolve(viteProcess)
                    return
                }
                if (err != null) {
                    Error("vite", err)
                }else{
                    Debug("vite", data)
                    if (data.includes("ready")) {
                        resolve(viteProcess)
                    }
                }
            },
        )
    })
}