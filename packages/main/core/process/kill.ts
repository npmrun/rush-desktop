import { whichPlatform } from "@rush-desktop/main-tool"
import { ChildProcess, ChildProcessWithoutNullStreams, execSync } from "child_process"
import { spawn } from "cross-spawn"

const platform = whichPlatform()

export default function kill(process: ChildProcessWithoutNullStreams | null) {
    if (!process) return
    const pid = process.pid
    if (platform === "Linux") {
        console.log("kill -9 " + pid)
        spawn("kill", ["-9", String(pid)])
    }
    if (platform === "windows") {
        console.log("TASKKILL /F /T /PID " + pid)
        spawn("TASKKIll", ["/F", "/T", "/PID", String(pid)])
    }
}
