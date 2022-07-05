

import { shell, clipboard, Notification } from "electron"
import { appTrayPath } from "@rush-desktop/main-tool"

export function openDir(path: string){
    shell.openPath(path)
}

export function copyText(text: string) {
    clipboard.writeText(text, "clipboard")
    // const n = new Notification({title: "片段复制", body: "复制成功，请在您需要的地方粘贴", icon: appTrayPath})
    // n.show()
}
