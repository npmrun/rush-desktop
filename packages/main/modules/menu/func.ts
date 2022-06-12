import { broadcast, platform } from "@rush-desktop/main-tool"
import { showAboutWindow } from "@/function/window/about"
import { setupTray } from "@/function/window/tray"
import Shared from "@/share"
import { BrowserWindow, Menu, app, ipcMain, MenuItemConstructorOptions } from "electron"
import { cloneDeep } from "lodash"

function updateMenu(id: string, key: string, value: any) {
    const menus = cloneDeep(template)
    const _update = (menus: any) => {
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i]
            if (menu.id === id) {
                menu[key] = value
                return
            }
            if (menu.submenu && menu.submenu.length) {
                _update(menu.submenu)
            }
        }
    }
    _update(menus)
    template = menus
    const menuTemp = Menu.buildFromTemplate(<any>template)
    Menu.setApplicationMenu(menuTemp)
}
let template: MenuItemConstructorOptions[] = []
export function setMenuListData(list: MenuItemConstructorOptions[]) {
    template = list
}

export function getMenuListData(): MenuItemConstructorOptions[] {
    return template
}

export function alwaysTop(item: any, focusedWindow: BrowserWindow) {
    if (Shared.data.mainWindow?.isAlwaysOnTop()) {
        Shared.data.mainWindow.setAlwaysOnTop(false)
        updateMenu("alwaysTopID", "label", "置顶")
    } else {
        Shared.data.mainWindow?.setAlwaysOnTop(true)
        updateMenu("alwaysTopID", "label", "取消置顶")
    }
}

export function clickShowAbout(item: any, focusedWindow: BrowserWindow) {
    // https://www.electronjs.org/docs/api/browser-window#winsetmenubarvisibilityvisible-windows-linux
    showAboutWindow()
}

export function reload(item: any, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        // 重载之后, 刷新并关闭所有的次要窗体
        if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                    win.close()
                }
            })
        }
        focusedWindow.reload()
    }
}

export function MinialToTray(item: any, focusedWindow: BrowserWindow) {
    Shared.data.lastChoice = 1
    if (Shared.data.trayWindow) {
        Shared.data.mainWindow?.hide() // 调用 最小化实例方法
    } else {
        setupTray()
    }
}

export function fullScreen(item: any, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
    }
}

export function toggleDevTools(item: any, focusedWindow: BrowserWindow) {
    if (focusedWindow) {
        // @ts-ignore
        focusedWindow.toggleDevTools()
    }
}
