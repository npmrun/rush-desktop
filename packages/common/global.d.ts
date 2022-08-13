/// <reference types="electron" />

interface IMenuItemOption extends Electron.MenuItemConstructorOptions {
    // 参见：https://www.electronjs.org/docs/api/menu-item
    _click_evt?: string
}

interface IPopupMenuOption {
    menu_id: string
    items: IMenuItemOption[]
}

type TConfig = {
    language: "zh" | "en"
    backup_rule: string
    editor_logo: boolean | string
    get storagePath(): string
    set storagePath(value: string)
}


type TAgent<T = (event: Electron.IpcRendererEvent, ...args: any[]) => void> = {
    preloadPath: string;
    iframePath: string;
    extraPath: string;
    file: any;
    call: (command: string, ...args: any[]) => Promise<any>;
    callLong: (command: string, ...args: any[]) => Promise<any>;
    callSync: (command: string, ...args: any[]) => any;
    send: (command: string, ...argu: any[]) => void;
    sendSync: (command: string, ...argu: any[]) => void;
    on: (command: string, cb: T) => () => Electron.IpcRenderer;
    once: (command: string, cb: T) => () => Electron.IpcRenderer;
    off: (command: string, cb: T) => Electron.IpcRenderer;
    offAll: (command: string) => Electron.IpcRenderer;
    popupMenu: (options: IPopupMenuOption) => void;
}

declare const _agent: TAgent

type WebviewTag = Electron.WebviewTag