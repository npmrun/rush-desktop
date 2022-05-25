import build from "@/build"
import path from "path"
import rimraf from "rimraf"
import { pkgPath, rootPath } from "@rush-desktop/share"
import fs from "fs-extra"

rimraf.sync(path.resolve(rootPath, "dist/electron"))
rimraf.sync(path.resolve(rootPath, "dist/node_modules"))
rimraf.sync(path.resolve(rootPath, "dist/package-lock.json"))

fs.ensureDirSync(path.resolve(rootPath, "dist/electron"))
fs.copyFileSync(path.resolve(pkgPath, "main/index.html"), path.resolve(rootPath, "dist/electron/index.html"))

build()
