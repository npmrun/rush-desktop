import { broadcast } from "./broadcast"
import path from "path"

declare const __extra: string
export const appIconPath = path.join(__extra, "/icons/180x180.png")

export { broadcast }

export const isDev = process.env.NODE_ENV === "development"
export const isProd = !isDev

export function getFileUrl(app: string = "", route: string = "") {
    const winURL =
        process.env.NODE_ENV === "development"
            ? `http://localhost:${process.env.PORT}/${app}#/${route}`
            : `file://${__dirname}/${app}#/${route}`
    return winURL
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

// 超级命令：从对象中解析出函数
export function readCommand(func: Record<any, any>, command: string): Function | undefined {
    let commands = command.split(".")
    let len = commands.length
    let curIndex = 0
    let curObj = func
    let lastObj = func
    while (curIndex < len) {
        // @ts-ignore
        let myFunc = curObj[commands[curIndex]]
        if (!myFunc) return
        lastObj = curObj
        curObj = myFunc
        curIndex++
    }

    if (typeof curObj === "function" && lastObj) {
        curObj = curObj.bind(lastObj)
    }
    // @ts-ignore
    return curObj
}

export function isPromise(value: Function) {
    return value && Object.prototype.toString.call(value) === "[object Promise]"
}
