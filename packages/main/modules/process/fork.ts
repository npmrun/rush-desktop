import { fork } from "child_process"
import path from "path"

let scriptPath = path.join(__resource, "app.asar/node_modules/live-server/live-server.js")

export function forkFn(
    file: string,
    argu?: string[],
    callback?: (err?: any, data?: any, isComplete?: boolean) => void,
    env?: {},
) {
    let myProcess = fork(path.join(__dirname), argu, {
        stdio: "pipe",
        env: env,
    })
    myProcess.stdout.on("data", data => {
        callback && callback(null, `${data}`)
    })
    myProcess.on("error", err => {
        callback && callback(`${err}`)
    })
    myProcess.stderr.on("data", data => {
        callback && callback(`${data}`)
    })

    myProcess.on("close", code => {
        callback && callback(null, `${code}`, true)
    })
    return myProcess
}
