import * as db from "@rush/main-tool/db"
import { app } from "electron"

export { db }

export function getPath(
    name:
        | "home"
        | "appData"
        | "userData"
        | "cache"
        | "temp"
        | "exe"
        | "module"
        | "desktop"
        | "documents"
        | "downloads"
        | "music"
        | "pictures"
        | "videos"
        | "recent"
        | "logs"
        | "crashDumps",
) {
    return app.getPath(name)
}
