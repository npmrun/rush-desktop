import { resolve } from "path"

export const rootPath = resolve(__dirname, "../../")
export const pkgPath = resolve(__dirname, "../../packages")

export const distPath = resolve(rootPath, "dist")
export const outPath = resolve(rootPath, "dist/electron")

export const isVite = true
export const viteCMD = resolve(rootPath, "node_modules/vite/bin/vite.js")
export const viteConfig = resolve(pkgPath, "render/vite.config.ts")

export const electronEntry = resolve(rootPath, "dist/electron/entry.js")

export const mainWebpackDevEntry = resolve(pkgPath, "main/index.dev.ts")
export const mainWebpackBuildEntry = resolve(pkgPath, "main/index.ts")
export const mainWebpackName = "entry.js"
export const mainWebpackOutput = resolve(rootPath, "dist/electron")
export const mainTsConfig = resolve(pkgPath, "main/tsconfig.json")

export const preloadWebpackEntry = {
    preload: resolve(pkgPath, "preload/preload.ts")
}
export const preloadWebpackName = "[name].js"
export const preloadWebpackOutput = resolve(rootPath, "dist/electron")
export const preloadTsConfig = resolve(pkgPath, "preload/tsconfig.json")

export const buildExternals = resolve(rootPath, "package.json")


export function genPathRoot(...argu: string[]): string {
    return resolve(rootPath, ...argu)
}