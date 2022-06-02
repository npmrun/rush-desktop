import { Mitt, Msg } from "@/core/mitt"
import { ChildProcessWithoutNullStreams } from "child_process"
import { execa } from "./execa"
import kill from "./kill"
import { iGetInnerText } from "@rush-desktop/common/util"
import { EProcessStatus } from "@rush-desktop/common/process"
import { broadcast } from "@rush-desktop/main-tool"

interface IProcessChild {
    key: number | string
    command: string
    status: EProcessStatus
    log: string[]
    instance: null | ChildProcessWithoutNullStreams
}

class ProcessManager {
    private constructor() {}
    static instance: null | ProcessManager = null
    static getInstance() {
        if (ProcessManager.instance == null) {
            ProcessManager.instance = new ProcessManager()
        }
        return ProcessManager.instance
    }

    private _processlist: IProcessChild[] = []

    getList() {
        let array = this._processlist.map(v => {
            let obj = Object.assign({}, v) as any
            delete obj.instance
            return obj
        })
        return array
    }

    getProcess(key: string | number) {
        let array = this._processlist.filter(v => {
            return v.key === key
        })
        let instance = array[0]
        if (instance) {
            let obj = Object.assign({}, instance) as any
            delete obj.instance
            return obj
        }
    }

    createProcess(key: string | number, command: string, args: string[] = []): boolean {
        let pro = this._processlist.filter(v => v.key === key)[0]
        if (pro) {
            return false
        }
        let oneProcess: IProcessChild = {
            key: -1,
            command,
            log: [],
            status: EProcessStatus.Normal,
            instance: null,
        }
        oneProcess.status = EProcessStatus.Starting
        broadcast("event:process", { key: key, status: oneProcess.status })
        let p = execa(command, args, (err, data, isComplete) => {
            console.log(err, data);
            
            if (isComplete) {
                oneProcess.status = EProcessStatus.Exit
                broadcast("event:process", {
                    key: key,
                    status: oneProcess.status,
                    message: iGetInnerText(`${data}`),
                })
                oneProcess.log.push(`${data}`)
                this.clearOneDeath(p)
                return
            }
            if (err) {
                broadcast("event:process", { key: key, status: oneProcess.status, message: err })
                oneProcess.log.push(err)
            } else {
                broadcast("event:process", { key: key, status: oneProcess.status, message: iGetInnerText(data) })
                oneProcess.log.push(iGetInnerText(data))
            }
        })
        p.on("spawn", () => {
            oneProcess.status = EProcessStatus.Running
            broadcast("event:process", { key: key, status: oneProcess.status })
        })
        oneProcess.key = key
        oneProcess.instance = p
        this._processlist.push(oneProcess)
        return true
    }

    killAll() {
        let list = this._processlist
        for (let i = 0; i < list.length; i++) {
            const process = list[i]
            const instance = process.instance
            if (instance) {
                process.status = EProcessStatus.Stopping
                broadcast("event:process", { key: process.key, status: process.status })
                kill(process.instance)
            }
        }
    }
    kill(key: string | number) {
        let list = this._processlist
        for (let i = 0; i < list.length; i++) {
            const process = list[i]
            if (process.key === key) {
                const instance = process.instance
                if (instance) {
                    process.status = EProcessStatus.Stopping
                    broadcast("event:process", { key: process.key, status: process.status })
                    kill(process.instance)
                }
                break
            }
        }
    }
    clearOneDeath(p: ChildProcessWithoutNullStreams) {
        let list = this._processlist
        let len = list.length
        for (let i = len - 1; i >= 0; i--) {
            const process = list[i]
            const instance = process.instance
            if (instance === p) {
                if (process.status === EProcessStatus.Exit || process.status === EProcessStatus.Normal) {
                    kill(process.instance)
                    this._processlist.splice(i, 1)
                }
                if (instance?.killed) {
                    this._processlist.splice(i, 1)
                }
                break
            }
        }
    }
    clearAllDeath() {
        let list = this._processlist
        let len = list.length
        let count = 0
        for (let i = len - 1; i >= 0; i--) {
            const process = list[i]
            const instance = process.instance
            if ((process.status === EProcessStatus.Exit || process.status === EProcessStatus.Normal) && instance) {
                kill(process.instance)
                count++
                this._processlist.splice(i, 1)
            }
            if (instance?.killed) {
                count++
                this._processlist.splice(i, 1)
            }
        }
        console.log("去除" + count + "个子进程")
        console.log("当前还剩" + this._processlist.length + "个子进程")
    }
}

export default ProcessManager.getInstance()
