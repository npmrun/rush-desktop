import { spawn } from "child_process"

export function execa(
    command: string,
    argu: string[],
    callback?: (err?: any, data?: any, isComplete?: boolean) => void,
    env?: {},
) {
    let myProcess = spawn(command, argu, {
        stdio: "pipe",
        env: env,
    })
    myProcess.stdout.on("data", data => {
        callback && callback(null, `${data}`)
    })
    myProcess.on("error", (err)=>{
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

export function whichPlatform() {
    var platform = process.platform
    switch (platform) {
        case "aix":
            return "IBM AIX"
        case "darwin":
            return "MacOS"
        case "freebsd":
            return "FreeBSD"
        case "linux":
            return "Linux"
        case "openbsd":
            return "OpenBSD"
        case "sunos":
            return "SunOS"
        case "win32":
            return "windows"
        default:
            return "unknown"
    }
}

const exec = require('child_process').exec;

function execute(command: string) {
    console.log("Executing Command : ", command);
    return new Promise((resolve, reject) => {
        exec(command, {
            maxBuffer: 1024 * 5000000
        }, (error: Error, stdout: any, stderr: any) => {
            if (error) {
                console.log(`ERROR: Something went wrong while executing ${command}: ${error}`);
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

export function kill(pid: number) {
    return new Promise<void>((resolve,reject)=>{
        try {
            console.log(`Killing Process : ${pid}`);
            process.kill(pid, 'SIGTERM');
            let command = `ps -efww | grep ${pid} | grep -v grep | grep -v dzdo `;
            let output = execute(command).then(res => {
                console.log(`output: ${res}`);
                resolve()
            }).catch(err => {
                console.log(err)
                reject(err)
            });
        } catch (e) {
            console.log(`Invalid Process ID:${pid}, failed during kill, "ERROR: ${e}"`);
            reject(e)
        }
    })
}
