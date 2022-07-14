import { broadcast, platform } from "@rush/main-tool"
import { showAboutWindow } from "@/function/window/about"
import { setupTray } from "@/function/window/tray"
import Shared from "@/share"
import { BrowserWindow, Menu, app, ipcMain, MenuItemConstructorOptions } from "electron"
import { cloneDeep } from "lodash"
import {windowsMenu} from "./windowsMenu"
import {macMenu} from "./macMenu"
import "./popup"
import { mainConfig } from "@/config"

export function initMenu(oldMainConfig?: TConfig) {
    console.log(`考虑i18n,当前语言为: ${mainConfig.language})`);
    let menuList:MenuItemConstructorOptions[]  = windowsMenu
    if(platform === "MacOS"){
        menuList = macMenu
    }
    const menu = Menu.buildFromTemplate(<any>menuList)
    Menu.setApplicationMenu(menu)
}
