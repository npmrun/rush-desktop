const { say } = require("cfonts")
const chalk = require("chalk")

function electronLog(data: string[] | string, color = "yellow") {
    let log = ""
    data = data.toString().split(/\r?\n/)
    data.forEach(line => {
        log += `  ${line}\n`
    })
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold("┏ Electron -------------------") + "\n\n" + log + chalk[color].bold("┗ ----------------------------") + "\n"
        )
    }
}

function logStats(proc: string, data: any, color = "yellow") {
    let log = ""

    log += chalk[color].bold(`┏ ${proc} Process ${new Array(19 - proc.length + 1).join("-")}`)
    log += "\n\n"

    if (typeof data === "object") {
        data
            .toString({
                colors: true,
                chunks: false,
            })
            .split(/\r?\n/)
            .forEach((line: string) => {
                log += "  " + line + "\n"
            })
    } else {
        log += `  ${data}\n`
    }

    log += "\n" + chalk[color].bold(`┗ ${new Array(28 + 1).join("-")}`) + ""

    console.log(log)
}

function greeting() {
    const cols = process.stdout.columns
    let text

    if (cols > 104) text = "RUN-FORREST"
    else if (cols > 76) text = "RUN-|FORREST"
    else text = false

    if (text) {
        say(text, {
            colors: ["red"],
            font: "simple3d",
            space: false,
        })
    } else console.log(chalk.yellow.bold("\n  RUN-FORREST"))
    // console.log(chalk.blue("  getting ready...") + "\n")
    console.log("\n")
}
// greeting()
// electronLog("dfssssssssssssssssssssssssssssssssssssssssssssssss", "red")
// logStats("Electron", "testtest", "red")

const Warnning = (name: string, data: string) => logStats(name + " warn", data, "yellow")
const Error = (name: string, data: string) => logStats(name + " error", data, "red")
const Debug = (name: string, data: string) => logStats(name, data, "black")

export { greeting, Warnning, Error, Debug }
