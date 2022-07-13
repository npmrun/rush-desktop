

import { shell, clipboard, Notification } from "electron"
import { appTrayPath } from "@rush-desktop/main-tool"
import fs from "fs"

export function openDir(path: string){
    shell.openPath(path)
}

export function copyText(text: string) {
    clipboard.writeText(text, "clipboard")
    // const n = new Notification({title: "片段复制", body: "复制成功，请在您需要的地方粘贴", icon: appTrayPath})
    // n.show()
}
 
export function copyImageToFile() {
    // const image = clipboard.readImage("clipboard")
    // const buffer = image.toPNG();
    // console.log(clipboard.readText("clipboard"));
    // console.log(image.isEmpty());
    // console.log(buffer);
    
    // fs.writeFile("C:\\Users\\Administrator\\Pictures\\a.png", buffer, function (err: Error | null) {
    //     if(err) throw err;
    //     console.log("保存成功");
    // })
}