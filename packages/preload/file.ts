import fs from "fs-extra"

export function readFile(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err: Error, data: any) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data)
        })
    })
}
