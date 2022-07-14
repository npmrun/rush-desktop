import { broadcast, platform } from "@rush/main-tool"
import { showAboutWindow } from "@rush/main-func/window/about"
import { setupTray } from "@rush/main-func/window/tray"
import { Shared } from "@rush/main-share"
import { BrowserWindow, Menu, app, ipcMain, MenuItemConstructorOptions } from "electron"
import { cloneDeep } from "lodash"
import {windowsMenu} from "./windowsMenu"
import {macMenu} from "./macMenu"
import "./popup"
import { mainConfig } from "@rush/main-config"

export function initMenu(oldMainConfig?: TConfig) {
    console.log(`考虑i18n,当前语言为: ${mainConfig.language})`);
    let menuList:MenuItemConstructorOptions[]  = windowsMenu
    if(platform === "MacOS"){
        menuList = macMenu
    }
    const menu = Menu.buildFromTemplate(<any>menuList)
    Menu.setApplicationMenu(menu)
}
