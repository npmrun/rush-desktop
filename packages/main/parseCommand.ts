const modelsFile = require.context("../main-func", true, /\.ts$/)
const funcs = {}
modelsFile.keys().forEach(key => {
    const res = modelsFile(key)
    const module = res.default || res
    funcs[key.replace(/(\.\/|\.ts)/g, "").split("/").filter(v=>v!="index").join("/")] = module
})

export function parseCommand(command: string): Function | undefined {
    let commands = command.split(".")
    const modulePath = commands.slice(0, -1).join("/")
    let funcName = commands[commands.length - 1]
    const module = funcs[modulePath]
    if (module) {
        const func = module[funcName]
        if (func) {
            const result = func.bind(module)
            if (typeof result === "function") {
                return result
            }
        }
    }
}
