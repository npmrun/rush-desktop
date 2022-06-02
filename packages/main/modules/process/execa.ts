// import { spawn } from "cross-spawn"
import { spawn } from "child_process"
import fs from "fs-extra"
import path from "path"
import {app} from "electron"
export function execa(
    command: string,
    argu?: string[],
    callback?: (err?: any, data?: any, isComplete?: boolean) => void,
    env?: {},
) {
    fs.writeFileSync(path.resolve(app.getAppPath(), "./app.txt"), __appPath+'\n'+command+'\n'+argu)
    console.log(__appPath);
    console.log(command, argu);
    let myProcess = spawn(command, argu, {
        cwd: __appPath,
        stdio: "pipe",
        env: env
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
