import * as builder from "electron-builder"
import setting from "@rush-desktop/share/setting.json"
import { rootPath } from "@rush-desktop/share"
import path from "path"
// import rebuild from "electron-rebuild"

builder.build({
    config: {
        // async beforeBuild(context) {
        //     const { appDir, electronVersion, arch } = context
        //     await rebuild({ buildPath: appDir, electronVersion, arch })
        //     return true
        // },
        nmpRebuild: true, // 是否在打包应用程序之前rebuild本地依赖
        nodeGypRebuild: false, // 是否在开始打包应用程序之前执行,用electron-builder node-gyp-rebuild 来代替
        buildDependenciesFromSource: true, // 是否从源构建应用程序本机依赖项。
        productName: setting.app_title,
        appId: "com.dash." + setting.app_title,
        copyright: "Copyright © 2022 Dash.All Rights Reserved.",
        directories: {
            output: path.resolve(rootPath, "out"),
            app: path.resolve(rootPath, "dist"),
        },
        nsis: {
            oneClick: false,
            allowElevation: true,
            createDesktopShortcut: true,
            createStartMenuShortcut: true,
            allowToChangeInstallationDirectory: true,
            perMachine: true,
        },
        dmg: {
            contents: [
                {
                    x: 410,
                    y: 150,
                    type: "link",
                    path: "/Applications",
                },
                {
                    x: 130,
                    y: 150,
                    type: "file",
                },
            ],
        },
        extraResources: {
            from: path.resolve(rootPath, "extra"),
            to: "",
        },
        mac: {
            icon: path.resolve(rootPath, "extra/icons/180x180.png"),
        },
        win: {
            icon: path.resolve(rootPath, "extra/icons/1024x1024.png"),
            target: [
                {
                    target: "nsis",
                    arch: ["ia32"],
                },
            ],
        },
        linux: {
            icon: path.resolve(rootPath, "extra/icons/1024x1024.png"),
        },
    },
})
