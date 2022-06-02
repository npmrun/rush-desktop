// import { spawn } from "cross-spawn"
import { spawn } from "child_process"

export function execa(
    command: string,
    argu?: string[],
    callback?: (err?: any, data?: any, isComplete?: boolean) => void,
    env?: {},
) {
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
