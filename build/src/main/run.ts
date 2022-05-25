// @ts-nocheck
import { Debug, Error } from "@/utils/log"

const chalk = require("chalk")
const path = require("path")
const webpack = require("webpack")
import mainConfig from "./webpack.main.config"
import { getPath } from "@/utils/path"
import { mainWebpack } from "@/config"

export default function run(callback?:()=>any) {
    return new Promise<void>((resolve, reject) => {
        mainConfig.entry.main = [mainWebpack.devEntry] //.concat(mainConfig.entry.main)
        mainConfig.mode = "development"
        const compiler = webpack(mainConfig)

        compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
            Debug("Main", chalk.white.bold("compiling..."))
            // hotMiddleware.publish({ action: 'compiling' })
            done()
        })

        compiler.watch({}, (err, stats) => {
            if (err) {
                Error("Main", chalk.red.bold(err))
                return
            }

            Debug("Main", stats)

            callback && callback()
            resolve()
        })
    })
}
