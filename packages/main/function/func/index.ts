

import { shell } from "electron"

export function openDir(path: string){
    shell.openPath(path)
}
