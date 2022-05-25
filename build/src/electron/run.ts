import { execa } from "@/utils"
import { Debug, Error } from "@/utils/log"
import config from "@/config"
import { ChildProcess } from "child_process"

export default function run(cb?: ()=>void) {
    return new Promise<ChildProcess>((resolve, reject) => {
        // "--inspect=5858",
        const electronProcess = execa(
            config.rootElectronCMD,
            [config.rootElectronEntry],
            (err: any, data: any, isComplete?: boolean) => {
                if (isComplete) {
                    cb && cb()
                    resolve(electronProcess)
                    return
                }
                if (err != null) {
                    Error("electron", err)
                }else{
                    Debug("electron", data)
                }
            },
        )
        resolve(electronProcess)
    })
}
