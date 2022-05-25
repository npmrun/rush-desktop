// @ts-nocheck
import { Debug, Error } from "@/utils/log"

const chalk = require("chalk")
const path = require("path")
const webpack = require("webpack")
import mainConfig from "./webpack.main.config"
import { getPath } from "@/utils/path"
import { mainWebpack } from "@/config"

export default function build() {
    return new Promise((resolve, reject) => {
        mainConfig.entry.main = [mainWebpack.prodEntry]
        mainConfig.mode = "production"
        webpack(mainConfig, (err, stats) => {
            if (err) {
                Debug("Main", chalk.red.bold(err))
                reject(err.stack || err)
            } else if (stats.hasErrors()) {
                let err = ""
                stats
                    .toString({
                        chunks: false,
                        colors: true,
                    })
                    .split(/\r?\n/)
                    .forEach(line => {
                        err += `    ${line}\n`
                    })
                Error("Main", chalk.red.bold(err))
                reject(err)
            } else {
                Debug("Main", stats.toString({
                    chunks: false,
                    colors: true,
                }))
                resolve(
                    stats.toString({
                        chunks: false,
                        colors: true,
                    })
                )
            }
        })
    })
}
