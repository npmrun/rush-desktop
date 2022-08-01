import fs from "fs-extra"
import https from "https"
import path from "path"
import type { IncomingMessage } from "http"

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

export function savaFileByData(img_path: string, imgData: any) {
    return new Promise<void>((resolve, reject) => {
        let target = path.resolve(img_path)
        let p = path.parse(target)
        if (!fs.existsSync(p.dir)) {
            fs.mkdirSync(p.dir, { recursive: true })
        }
        fs.writeFile(target, imgData, function (err: Error | null) {
            if (err) {
                reject(err)
                return
            }
            resolve()
        })
    })
}

/**
 * 通过流保存文件至本地
 * @param url 图片网络地址
 * @param img_path 本地保存文件名
 * @returns Promise<void>
 */
export function savaFileByPipe(url: string, img_path: string) {
    return new Promise<void>((resolve, reject) => {
        https.get(url, function (req: IncomingMessage) {
            let target = path.resolve(img_path)
            let p = path.parse(target)
            if (!fs.existsSync(p.dir)) {
                fs.mkdirSync(p.dir, { recursive: true })
            }
            const write = fs.createWriteStream(img_path)
            req.pipe(write)
            write.on("error", function (err) {
                reject(err)
            })
            write.on("finish", function () {
                resolve()
            })
        })
    })
}

/**
 * 通过拼接块保存文件至本地
 * @param url 图片网络地址
 * @param img_path 本地保存文件名
 * @returns Promise<void>
 */
export function savaFileByChunk(url: string, img_path: string) {
    return new Promise<void>((resolve, reject) => {
        https.get(url, function (req: IncomingMessage) {
            var imgData = ""
            req.setEncoding("binary")
            req.on("data", function (chunk) {
                imgData += chunk
            })
            req.on("error", function (err) {
                reject(err)
            })
            req.on("end", function () {
                let target = path.resolve(img_path)
                let p = path.parse(target)
                if (!fs.existsSync(p.dir)) {
                    fs.mkdirSync(p.dir, { recursive: true })
                }
                fs.writeFile(target, imgData, "binary", function (err: Error | null) {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                })
            })
        })
    })
}
