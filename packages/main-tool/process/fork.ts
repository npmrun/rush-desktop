import { fork } from "child_process"

export function forkFn(
    file: string,
    argu?: string[],
    callback?: (err?: any, data?: any, isComplete?: boolean) => void,
    env?: {},
) {
    let myProcess = fork(file, argu, {
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
