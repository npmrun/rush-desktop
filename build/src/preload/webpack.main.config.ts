// @ts-nocheck

const webpack = require("webpack")
import { perloadWebpack } from "@/config"
import { preloadTsConfig } from "@rush/share"
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"

let mainConfig = {
    entry: perloadWebpack.entry,
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
        plugins: [new TsconfigPathsPlugin({
            configFile: preloadTsConfig
        })]
    },
    target: "electron-main",
}

export default mainConfig
