import { dialog } from 'electron'
import Shared from "@/share"
/**
 * 选择本地文件夹地址
 */
export function chooseDir(title: string, defaultPath: string) {
    return new Promise((resolve, reject)=>{
        dialog
        .showOpenDialog(Shared.data.focusWindow, {
            title: title,
            defaultPath: defaultPath,
            properties: ['openDirectory', 'openFile'],
        })
        .then((result) => {
            if(!result.canceled){
                let path = result.filePaths[0]
                resolve(path)
            }else{
                reject(new Error("取消选择"))
            }
        })
        .catch((err) => {
            reject(err)
        }) 
    })
}
export function error(title: string, message: string) {
    return new Promise((resolve, reject)=>{
        dialog.showErrorBox(title, message)
        resolve(void 0)
    })
}

export function confrim(opt: any) {
    return new Promise((resolve, reject)=>{
        dialog
        .showMessageBox(Shared.data.focusWindow, {
            title: opt.title || "",
            message: opt.message,
            type: "question",
            defaultId: 0,
            cancelId: 0,
            buttons: opt.textList ?? ["取消", "确定"],
        })
        .then((result) => {
            resolve(result.response)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
