import electron from "electron"
import fs from "fs-extra"
import {
    rootPath,
    viteCMD,
    viteConfig,
    electronEntry,
    genPathRoot,
    preloadWebpackOutput,
    preloadWebpackName,
    preloadWebpackEntry,
    mainWebpackDevEntry,
    mainWebpackBuildEntry,
    mainWebpackName,
    mainWebpackOutput,
    buildExternals,
    pkgPath,
} from "@rush-desktop/share"

const config = {
    rootPath: rootPath,
    rootViteCMD: viteCMD,
    rootViteConfig: viteConfig,
    rootElectronCMD: electron as unknown as string,
    rootElectronEntry: electronEntry,
}

let externals: string[] = []
if (fs.existsSync(buildExternals)) {
    externals = Object.keys(fs.readJSONSync(buildExternals).dependencies)
}
export const mainWebpack = {
    devEntry: mainWebpackDevEntry,
    prodEntry: mainWebpackBuildEntry,
    outputName: mainWebpackName,
    outputPath: mainWebpackOutput,
    externals: externals,
    devVariable: {
        // __static: `"${genPathRoot("public/static").replace(/\\/g, "\\\\")}"`,
        // __public: `"${genPathRoot("public").replace(/\\/g, "\\\\")}"`,
        __extra: `"${genPathRoot("extra").replace(/\\/g, "\\\\")}"`,
        __resource: `"${genPathRoot("dist/electron").replace(/\\/g, "\\\\")}"`,
        __appPath: `"${genPathRoot(pkgPath, "main").replace(/\\/g, "\\\\")}"`
    },
    prodVariable: {
        // __static: `require("path").join(__dirname, "/static").replace(/\\\\/g, "\\\\\\\\")`,
        // __public: `require("path").join(__dirname).replace(/\\\\/g, "\\\\\\\\")`,
        __extra: `require("path").join(__dirname, "../..").replace(/\\\\/g, "\\\\\\\\")`,
        __resource: `require("path").join(__dirname).replace(/\\\\/g, "\\\\\\\\")`,
        __appPath: `require("path").join(__dirname, "../").replace(/\\\\/g, "\\\\\\\\")`,
    },
}
export const perloadWebpack = {
    entry: preloadWebpackEntry,
    outputName: preloadWebpackName,
    outputPath: preloadWebpackOutput,
    externals: externals,
}

export default config
