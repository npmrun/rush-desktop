import path from "path"
import rimraf from "rimraf"

rimraf.sync(path.resolve(__dirname, "../dist/electron"))
rimraf.sync(path.resolve(__dirname, "../dist/scripts"))
// rimraf.sync(path.resolve(__dirname, "../dist/node_modules"))
rimraf.sync(path.resolve(__dirname, "../dist/package-lock.json"))