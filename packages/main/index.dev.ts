// Install `electron-debug` with `devtron`
import { app, session } from "electron"
import electronDebug from "electron-debug"
import path from "path"

electronDebug({ showDevTools: true })

// app.on("browser-window-created", (event, win) => {
//     session
//         .fromPartition("persist:main")
//         .loadExtension(path.resolve(__dirname, "../../extensions/vue-devtools_6.0.12"))
//         .then(() => {})
//         .catch((err: Error) => {
//             console.log("Unable to install `vue-devtools`: \n", err)
//         })
// })

// Install `vue-devtools` in first browserwindow
app.on("ready", () => {
    // session.defaultSession
    //     .loadExtension(
    //         path.resolve(__dirname, '../../extensions/vue-devtools_6.0.12')
    //     )
    //     .then(() => {})
    //     .catch((err: Error) => {
    //         console.log('Unable to install `vue-devtools`: \n', err)
    //     })
})

// Require `main` process to boot app
import "./index"
