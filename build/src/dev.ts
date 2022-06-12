import devVite from "./vite/run"
import devElectron from "./electron/run"
import { Debug, Warnning } from "@/utils/log"
import fs from "fs-extra"
import { ChildProcess, execSync } from "child_process"
import { whichPlatform } from "@/utils"
import startMain from "./main/run"
import startPreload from "./preload/run"

import path from "path"
import config from "./config"
import { isVite } from "@rush-desktop/share"

const txtPath = path.resolve(config.rootPath, "./electron-pid.txt")

function killElectron() {
    return new Promise<void>((resolve, reject) => {
        const pid = fs.readFileSync(txtPath, { encoding: "utf-8" })
        let platform = whichPlatform()
        if (pid != "exit" && !isNaN(+pid)) {
            if (platform === "Linux") {
                console.log("kill -9 " + pid)
                execSync(`kill -9 ${pid}`)
                resolve()
            }
            if (platform === "MacOS") {
                console.log("kill -9 " + pid)
                execSync(`kill -9 ${pid}`)
                resolve()
            }
            if (platform === "windows") {
                console.log("TASKKILL /F /T /PID " + +pid)
                execSync("TASKKILL /F /T /PID " + +pid)
                resolve()
            }
            writeElectronPid("exit")
        }
    })
}
function writeElectronPid(txt: string) {
    fs.writeFileSync(txtPath, txt + "\n", { encoding: "utf-8" })
}

export default function dev() {
    fs.ensureFileSync(txtPath)
    ;(async () => {
        let vitePorcess: ChildProcess | undefined = undefined
        if (isVite) {
            vitePorcess = await devVite()
        }
        Debug("vite", "vite ready.")
        let child: ChildProcess | null = null
        let manualRestart = false
        process.on("SIGINT", async function () {
            console.log("\n")
            await killElectron()
            console.log("electron 清理")
            console.log("\n")
            process.exit()
        })
        startPreload()
        startMain(async () => {
            if (child && !!child.kill) {
                manualRestart = true
                await killElectron()
                // app.exit()
                // child?.pid && process.kill(child.pid)
                // child?.pid && kill(child.pid)
                setTimeout(() => {
                    manualRestart = false
                }, 5000)
            }
            try {
                child = await devElectron()
                writeElectronPid(child.pid + "")
                Warnning("electron", "ready")
                child.on("close", async () => {
                    if (!manualRestart) {
                        // https://juejin.cn/post/6844904071682326535
                        // vitePorcess.pid && kill(vitePorcess.pid)
                        vitePorcess?.pid && process.kill(vitePorcess.pid)
                        // await killElectron()
                        // child?.pid && kill(child.pid)
                        // child?.pid && process.kill(child.pid)
                        process.exit()
                    }
                })
            } catch (ev: any) {
                console.log(ev)
                // vitePorcess.pid && kill(vitePorcess.pid)
                vitePorcess?.pid && process.kill(vitePorcess.pid)
                // child?.pid && kill(child.pid)
                // child?.pid && process.kill(child.pid)
                process.exit()
            }
        })
    })()
}
