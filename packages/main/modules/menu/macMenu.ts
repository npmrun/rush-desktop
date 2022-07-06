import * as MenuFunc from "./func"
import setting from "@rush-desktop/share/setting.json"

MenuFunc.setMenuListData([
    {
        label: setting.app_title,
        submenu: [
            {
                label: "关于",
                click: MenuFunc.clickShowAbout,
            },
        ],
    },
    {
        label: "常用功能",
        submenu: [
            {
                label: "置顶",
                id: "alwaysTopID",
                click: MenuFunc.alwaysTop,
            },
            {
                label: "重载",
                accelerator: "CmdOrCtrl+R",
                click: MenuFunc.reload,
            },
            {
                label: "最小化到托盘",
                click: MenuFunc.MinialToTray,
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
                click: MenuFunc.fullScreen,
            },
        ],
    },
    {
        label: "帮助",
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
                click: MenuFunc.toggleDevTools,
            },
            {
                label: "检查更新",
            },
        ],
    },
])

export let macMenu = MenuFunc.getMenuListData()
