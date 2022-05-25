import dev from "./src/dev"
import fs from "fs-extra"
import path from "path"
import { pkgPath, rootPath } from "@rush-desktop/share"

fs.ensureDirSync(path.resolve(rootPath, "dist/electron"))
fs.copyFileSync(path.resolve(pkgPath, "main/index.html"), path.resolve(rootPath, "dist/electron/index.html"))

dev()
