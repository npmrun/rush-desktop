import { broadcast, platform } from "@rush/main-tool"
import { showAboutWindow } from "@/function/window/about"
import { setupTray } from "@/function/window/tray"
import Shared from "@/share"
import { BrowserWindow, Menu, app, ipcMain } from "electron"
import { cloneDeep } from "lodash"

function updateMenu(id: string, key: string, value: any) {
    const menus = cloneDeep(windowsMenu)
    const _update = (menus: any)=>{
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            if (menu.id === id) {
                menu[key] = value
                return
            }
            if(menu.submenu && menu.submenu.length){
                _update(menu.submenu)
            }
        }
    }
    _update(menus)
    windowsMenu = menus
    const menuTemp = Menu.buildFromTemplate(<any>windowsMenu)
    Menu.setApplicationMenu(menuTemp)
}

export let windowsMenu = [
    {
        label: "置顶",
        id: "alwaysTopID",
        click: function (item: any, focusedWindow: BrowserWindow) {
            if (Shared.data.mainWindow?.isAlwaysOnTop()) {
                Shared.data.mainWindow.setAlwaysOnTop(false)
                updateMenu("alwaysTopID", "label", "置顶")
            } else {
                Shared.data.mainWindow?.setAlwaysOnTop(true)
                updateMenu("alwaysTopID", "label", "取消置顶")
            }
        },
    },
    {
        label: "重载",
        accelerator: "CmdOrCtrl+R",
        click: function (item: any, focusedWindow: BrowserWindow) {
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
        },
    },
    {
        label: "功能",
        submenu: [
            // {
            //     label: "悬浮窗",
            //     click: function (item: any, focusedWindow: BrowserWindow) {

            //     },
            // },
            {
                label: "最小化到托盘",
                click: function (item: any, focusedWindow: BrowserWindow) {
                    Shared.data.lastChoice = 1
                    if (Shared.data.trayWindow) {
                        Shared.data.mainWindow?.hide() // 调用 最小化实例方法
                    } else {
                        setupTray()
                    }
                },
            },
            {
                label: "切换全屏",
                accelerator: (function () {
                    if (process.platform === "darwin") {
                        return "Ctrl+Command+F"
                    } else {
                        return "F11"
                    }
                })(),
                click: function (item: any, focusedWindow: BrowserWindow) {
                    if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                    }
                },
            },
        ],
    },
    {
        label: "开发者",
        submenu: [
            {
                label: "切换开发者工具",
                accelerator: (function () {
                    if (process.platform === "darwin") {
                        return "Alt+Command+I"
                    } else {
                        return "Ctrl+Shift+I"
                    }
                })(),
                click: function (item: any, focusedWindow: BrowserWindow) {
                    if (focusedWindow) {
                        // @ts-ignore
                        focusedWindow.toggleDevTools()
                    }
                },
            },
        ],
    },
    // {
    //     label: "帮助",
    //     submenu: [
    //         {
    //             label: "设置",
    //             click: function (item: any, focusedWindow: BrowserWindow) {
    //                 broadcast("ev:opensetting")
    //             },
    //         },
    //         {
    //             label: "检查更新",
    //             click: function (item: any, focusedWindow: BrowserWindow) {

    //             },
    //         },
    //     ],
    // },
    // {
    //   label: '重新启动',
    //   click: function(item: any, focusedWindow: BrowserWindow) {
    //     app.exit()
    //     app.relaunch()
    //     // app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    //     // app.quit()
    //   }
    // },
    {
        label: "关于",
        click: function (item: any, focusedWindow: BrowserWindow) {
            // https://www.electronjs.org/docs/api/browser-window#winsetmenubarvisibilityvisible-windows-linux
            showAboutWindow()
        },
    },
]
