import devVite from "./vite/run"
import devElectron from "./electron/run"
import { Debug, Warnning } from "@/utils/log"
import fs from "fs-extra"
import { ChildProcess, execSync } from "child_process"
import execa from "execa"
import { whichPlatform, kill } from "@/utils"
import startMain from "./main/run"
import startPreload from "./preload/run"

import path, { resolve } from "path"
import {spawn} from "cross-spawn"
import config from "./config"
import ps from "ps-node"
import { isVite } from "@rush-desktop/share"

const txtPath = path.resolve(config.rootPath, "./electron-pid.txt")

function killElectron() {
    return new Promise<void>((resolve, reject) => {
        const pid = fs.readFileSync(txtPath, { encoding: "utf-8" })
        let platform = whichPlatform()
        if (pid != "exit" && !isNaN(+pid)) {
            // if (platform === "Linux") {
                // await kill(+pid)
                // execSync(`kill -9 ${pid}`)
                let process = null
                if (platform === "Linux") {
                    console.log("kill -9 " + pid)
                    // process = spawn('kill', ['-9', String(pid)])
                    execSync(`kill -9 ${pid}`)
                    resolve()
                }
                if (platform === "windows") {
                    console.log("TASKKILL /F /T /PID " + (+pid))
                    // process = spawn('TASKKIll', ['/F', '/T', '/PID', String(pid)])
                    execSync("TASKKILL /F /T /PID " + (+pid))
                    resolve()
                }
                // ps.lookup({ pid: +pid }, function (err, resultList) {
                //     if (err) {
                //         resolve()
                //         throw new Error(err.message);
                //     }
                //     var process = resultList[0];
                //     if (process) {
                //         if (platform === "Linux") {
                //             console.log("kill -9 " + pid)
                //             execSync(`kill -9 ${pid}`)
                //         }
                //         if (platform === "windows") {
                //             console.log("TASKKILL /F /T /PID " + (+pid))
                //             execSync("TASKKILL /F /T /PID " + (+pid))
                //         }
                //         resolve()
                //     }
                //     else {
                //         console.log('No such process found!');
                //         resolve()
                //     }
                // });
                // await execa("kill", ["-9", pid])
                // process.kill(+pid)
                // await exec2(`kill -9 ${pid}`)
            // }
            // if (platform === "windows") {
            //     console.log("TASKKILL /pid " + pid + " -t -f")
            //     // await kill(+pid)
            //     execSync("TASKKILL /pid " + pid + " -t -f")
                // await execa("TASKKILL", ["/pid", pid, "-t", "-f"])
                // process.kill(+pid)
                // await exec2(`TASKKILL /pid ${pid} -t -f`)
            // }
            // process.kill(+pid, "SIGTERM")
            writeElectronPid("exit")
        }
    })
}
function writeElectronPid(txt: string) {
    fs.writeFileSync(txtPath, txt + "\n", { encoding: "utf-8" })
}

export default function dev() {
    fs.ensureFileSync(txtPath);
    ; (async () => {
        let vitePorcess: ChildProcess|undefined = undefined
        if(isVite){
            vitePorcess =  await devVite()
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