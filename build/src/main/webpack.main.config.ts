// @ts-nocheck

process.env.BABEL_ENV = "main"

const path = require("path")
const webpack = require("webpack")
import { mainWebpack } from "@/config"

let mainConfig = {
    entry: {},
    externals: mainWebpack.externals,
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
                                declaration: false,
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
        __dirname: false, //process.env.NODE_ENV !== 'production', // 不转化为字符串
        __filename: false, //process.env.NODE_ENV !== 'production' // 不转化为字符串
    },
    output: {
        filename: mainWebpack.outputName, // [name]
        libraryTarget: "commonjs2",
        path: mainWebpack.outputPath,
    },
    plugins: [new webpack.NoEmitOnErrorsPlugin()],
    resolve: {
        alias: mainWebpack.alias,
        extensions: [".js", ".json", ".node", ".ts"],
    },
    target: "electron-main",
}

if (process.env.NODE_ENV !== "production") {
    mainConfig.plugins.push(new webpack.DefinePlugin(mainWebpack.devVariable))
} else {
    mainConfig.plugins.push(new webpack.DefinePlugin(mainWebpack.prodVariable))
}

export default mainConfig
