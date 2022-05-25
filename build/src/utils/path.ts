import { join as joinPath } from "path"
import config from "@/config"

export function getPath(...argu: string[]):string {
    return joinPath(config.rootPath , ...argu)
}
