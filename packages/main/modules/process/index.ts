import { ChildProcessWithoutNullStreams } from "child_process"
import { execa } from "./execa"
import kill from "./kill"

interface IProcessChild {
    key: number | string
    command: string
    status: EProcessStatus
    instance: null | ChildProcessWithoutNullStreams
}
enum EProcessStatus {
    Normal = "normal",
    Running = "running",
    Complete = "complete",
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

    createProcess(key: string | number, command: string, args: string[] = []): boolean {
        let pro = this._processlist.filter(v => v.key === key)[0]
        if (pro) {
            return false
        }
        console.log(command);
        
        let oneProcess: IProcessChild = {
            key: -1,
            command,
            status: EProcessStatus.Normal,
            instance: null,
        }
        let p = execa(command, args, (err, data, isComplete) => {
            if (isComplete) {
                oneProcess.status = EProcessStatus.Complete
                this.clearOneDeath(p)
                return
            }
            if (err) {
            } else {
            }
            oneProcess.status = EProcessStatus.Running
        })
        oneProcess.key = key
        oneProcess.status = EProcessStatus.Running
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
                kill(process.instance)
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
                kill(process.instance)
                this._processlist.splice(i, 1)
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
            if ((process.status === EProcessStatus.Complete || process.status === EProcessStatus.Normal) && instance) {
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
