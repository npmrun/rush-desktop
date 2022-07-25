import { Mitt } from "@rush/main-tool/mitt"
import { globalShortcut } from "electron"

export function init(oldMainConfig?: TConfig) {
    globalShortcut.unregisterAll()
    globalShortcut.register("Alt+CommandOrControl+I", () => {
        console.log("Electron loves global shortcuts!")
        // 全局发送
        Mitt.emit("app-message")
    })
}
