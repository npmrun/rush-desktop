// @ts-nocheck
import { Debug, Error } from "@/utils/log"

const chalk = require("chalk")
const path = require("path")
const webpack = require("webpack")
import mainConfig from "./webpack.main.config"
import { getPath } from "@/utils/path"

export default function run(callback?:()=>any) {
    return new Promise<void>((resolve, reject) => {
        mainConfig.mode = "development"
        const compiler = webpack(mainConfig)

        compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
            Debug("Preload", chalk.white.bold("compiling..."))
            // hotMiddleware.publish({ action: 'compiling' })
            done()
        })

        compiler.watch({}, (err, stats) => {
            if (err) {
                Error("Preload", chalk.red.bold(err))
                return
            }

            Debug("Preload", stats)

            callback && callback()
            resolve()
        })
    })
}
