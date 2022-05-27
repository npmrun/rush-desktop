import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
// import Components from 'unplugin-vue-components/vite'
import _ from "lodash"
import path from "path"
// import { outPath } from "@rush-desktop/share"
// console.log(outPath);

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    base: "./",
    server: {
        port: +process.env.PORT || 3000,
    },
    plugins: [vue()],
    build: {
        outDir: path.resolve(__dirname, "../../dist/electron"),
    },
})
