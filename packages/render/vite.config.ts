import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Components from "unplugin-vue-components/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import AutoImport from "unplugin-auto-import/vite"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import { createHtmlPlugin } from "vite-plugin-html"
import { viteMockServe } from "vite-plugin-mock"
import WindiCSS from "vite-plugin-windicss"
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"
import monacoEditorPlugin from "./plugins/vite-plugin-monaco-editor"

// import setting from "@rush-desktop/share/setting.json"

// console.log(setting)

import _ from "lodash"
import path from "path"

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
    const env = <ImportMetaEnv>loadEnv(mode, process.cwd())
    let isProd = env.PROD
    let isDev = env.DEV
    let prodMock = true
    console.log(env)
    console.log(process.cwd())
    return defineConfig({
        // root: __dirname,
        base: "./",
        server: {
            port: <number>(process.env.PORT ?? 3000),
        },
        resolve: {
            alias: {
                // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#quasar-cli
                // 9.1.9 版本必会出现那个警告，此时不需要去管他，等升级就好了。这里因为网页限制,不能使用eval,只能运行runtime了
                "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
                "@": path.join(__dirname, "src"),
            },
        },
        build: {
            outDir: path.resolve(__dirname, "../../dist/electron"),
        },
        plugins: [
            vue(),
            vueJsx(),
            // WindiCSS({
            //     scan: {
            //         dirs: ["."],
            //         fileExtensions: ["vue", "js", "jsx", "ts", "tsx"],
            //     },
            // }),
            monacoEditorPlugin({
                base: ".",
            }),
            createHtmlPlugin({
                minify: true,
                pages: [
                    {
                        entry: "src/main.ts",
                        filename: "index.html",
                        template: "html/index.html",
                        injectOptions: {
                            data: {
                                title: "rush-desktop",
                            },
                        },
                    },
                    // {
                    //     filename: "about.html",
                    //     template: "html/about.html",
                    //     injectOptions: {
                    //         data: {
                    //             title: "rush-desktop",
                    //         },
                    //     },
                    // },
                    // {
                    //     filename: "iframe.html",
                    //     template: "html/iframe.html",
                    //     injectOptions: {
                    //         data: {
                    //             title: "rush-desktop",
                    //         },
                    //     },
                    // },
                ],
            }),
        ],
    })
}
