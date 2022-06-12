import { isDev, isProd } from "@rush-desktop/main-tool"
import { rootPath, distPath } from "@rush-desktop/share"
import { app } from "electron"
import path from "path"

const resolvePath = (...argu: string[]) => {
    let p = app.getAppPath()
    if (isDev) {
        p = rootPath
    }
    return path.resolve(p, ...argu)
}
const resolveDist = (...argu: string[]) => {
    let p = app.getAppPath()
    if (isDev) {
        p = distPath
    }
    return path.resolve(p, ...argu)
}
const commands = {
    "live-server": resolvePath("node_modules/live-server/live-server.js"),
    show: resolveDist("scripts/main.js"),
}

export function checkCommand(str: string) {
    const p = commands[str]
    if (p) {
        return p
    }
}

export default commands
