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
import Inspector from "vite-plugin-vue-inspector"
import OptimizationPersist from "vite-plugin-optimize-persist"
import PkgConfig from "vite-plugin-package-config"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
// @ts-ignore
import PrincessResolver from "princess-ui/PrincessResolver"
// import setting from "@rush-desktop/share/setting.json"

// console.log(setting)

import _ from "lodash-es"
import path from "path"

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
    const env = <ImportMetaEnv>loadEnv(mode, __dirname)
    let isProd = mode === "production"
    let isDev = mode === "development"
    let prodMock = false
    return defineConfig({
        root: __dirname,
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
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: `@import (reference) "@/assets/style/global.less";`,
                    javascriptEnabled: true,
                },
            },
        },
        build: {
            outDir: path.resolve(__dirname, "../../dist/electron"),
        },
        plugins: [
            PkgConfig(),
            OptimizationPersist(),
            vue(),
            vueJsx(),
            Inspector(),
            WindiCSS({
                scan: {
                    dirs: ["."],
                    fileExtensions: ["vue", "js", "jsx", "ts", "tsx"],
                },
            }),
            monacoEditorPlugin({
                base: ".",
            }),
            vueI18n({
                compositionOnly: false,
                include: path.resolve(__dirname, "../common/languages/**"),
            }),
            Pages({
                dirs: [{ dir: path.resolve(__dirname, "src/pages"), baseRoute: "" }],
                exclude: ["**/_components/*.vue", "**/_ui/*.vue", "**/*copy.vue"],
                onRoutesGenerated(routes) {
                    routes.push({
                        path: "",
                        redirect: "/home"
                    } )
                    return routes
                },
            }),
            Layouts({
                layoutsDirs: path.resolve(__dirname, "src/layouts"),
                defaultLayout: "base",
            }),
            Components({
                dirs: [path.resolve(__dirname, "src/componentsAuto"), path.resolve(__dirname, "src/pagesUIAuto")],
                extensions: ["vue"],
                dts: "components.d.ts",
                resolvers: [NaiveUiResolver(), PrincessResolver()],
            }),
            AutoImport({
                include: [/\.[tj]sx?$/, /\.vue\??/],
                imports: ["vue", "vue-router", "pinia", "@vueuse/core", "vue-i18n"],
                dts: "auto-import.d.ts",
                dirs: ["src/hooksAuto"],
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [path.resolve(__dirname, "src/assets/icons")],
                // 指定symbolId格式
                symbolId: "icon-[dir]-[name]",
            }),
            createHtmlPlugin({
                minify: isProd,
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
                    {
                        filename: "about.html",
                        template: "html/about.html",
                        injectOptions: {
                            data: {
                                title: "rush-desktop",
                            },
                        },
                    },
                    {
                        filename: "iframe.html",
                        template: "html/iframe.html",
                        injectOptions: {
                            data: {
                                title: "rush-desktop",
                            },
                        },
                    },
                ],
            }),
            viteMockServe({
                mockPath: "src/mocks/mock",
                localEnabled: command === "serve",
                prodEnabled: command !== "serve" && prodMock,
                injectCode: `
                  import { setupProdMockServer } from '@/mocks/mockProdServer';
                  setupProdMockServer();
                `,
                logger: true,
            }),
        ],
    })
}
