import buildMain from "./main/build"
import buildPreload from "./preload/build"
import buildVite from "./vite/build"

export default function () {
    ; (async () => {
        // await buildVite()
        buildPreload()
        buildMain()
    })();

}