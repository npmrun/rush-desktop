import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"
import path from "path"

const _agent = {}

contextBridge.exposeInMainWorld("_agent", _agent)
