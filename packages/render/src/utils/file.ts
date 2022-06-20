export function file2Base64(f: File, cb?: (err: Error | null, data?: string) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.readAsDataURL(f)

        reader.onload = function () {
            resolve(reader.result as string)
            cb && cb(null, reader.result as string)
        }

        reader.onerror = function (event: ProgressEvent<FileReader>) {
            reject(new Error("error reader"))
            cb && cb(new Error("error reader"))
        }
    })
}
