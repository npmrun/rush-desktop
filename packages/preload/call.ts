import { ipcRenderer, IpcRendererEvent } from "electron"

let count = 0
export function callMethod(command: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!command) {
            console.warn("命令不能为空")
            return
        }
        count++
        const timestamp = new Date().getTime()
        const key = timestamp + "-" + count
        let timeID: any = null
        ipcRenderer.once(key, fn)

        function fn(event: any, err: any, res: any) {
            clearTimeout(timeID)
            if (err) {
                reject(err)
                return
            }
            resolve(res)
        }

        ipcRenderer.send("command", key, command, ...args)

        // 超过5s就取消监听
        timeID = setTimeout(() => {
            reject(new Error("超过5s未响应"))
            ipcRenderer.removeListener(key, fn)
        }, 5000)
    })
}

export function callMethodLong(command: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!command) {
            console.warn("命令不能为空")
            return
        }
        count++
        const timestamp = new Date().getTime()
        const key = timestamp + "-" + count
        ipcRenderer.once(key, fn)

        function fn(event: any, err: any, res: any) {
            if (err) {
                reject(err)
                return
            }
            resolve(res)
        }

        ipcRenderer.send("command", key, command, ...args)
    })
}

export function callMethodSync(
    command: string,
    ...args: any[]
){
    if (!command) {
        console.warn('命令不能为空')
        return
    }
    count++
    const timestamp = new Date().getTime()
    const key = timestamp+'-'+count
    const result = ipcRenderer.sendSync('command', key, command, ...args)
    if (!result) {
        return
    }
    return result
}
