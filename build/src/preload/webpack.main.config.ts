// @ts-nocheck

const path = require("path")
const webpack = require("webpack")
import { getPath } from "../utils/path"
import { perloadWebpack } from "@/config"
const MinifyPlugin = require("babel-minify-webpack-plugin")

let mainConfig = {
    entry: {
        main: perloadWebpack.entry,
    },
    externals: perloadWebpack.externals,
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: [
                    "babel-loader",
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false
                            },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.node$/,
                use: "node-loader",
            },
        ],
    },
    // https://www.webpackjs.com/configuration/node/
    node: {
        // __dirname: process.env.NODE_ENV !== 'production', // 不转化为字符串
        // __filename: process.env.NODE_ENV !== 'production' // 不转化为字符串
    },
    output: {
        filename: perloadWebpack.outputName, // [name]
        libraryTarget: "commonjs2",
        path: perloadWebpack.outputPath,
    },
    plugins: [new webpack.NoEmitOnErrorsPlugin()],
    resolve: {
        alias: perloadWebpack.alias,
        extensions: [".js", ".json", ".node", ".ts"],
    },
    target: "electron-main",
}

export default mainConfig
