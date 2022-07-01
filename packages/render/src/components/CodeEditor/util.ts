interface IFile {
    language: string
    ext?: string
    pre?: string
    index?: number
}

const files: IFile[] = [
    { language: "vue", ext: ".vue" },
    { language: "javascript", ext: ".js" },
    { language: "css", ext: ".css" },
    { language: "html", ext: ".html" },
    { language: "tsx", ext: ".tsx" },
    { language: "jsx", ext: ".jsx" },
    { language: "typescript", ext: ".ts" },
    { language: "markdown", ext: ".md" },
    { language: "dot", pre: "." },
]

export function judgeFile(filename: string) {
    if (!filename) return
    let ext = files
    let cur
    for (let i = 0; i < ext.length; i++) {
        const e = ext[i]
        if (e.ext && filename.endsWith(e.ext)) {
            let index = filename.lastIndexOf(e.ext)
            e.index = index
            cur = e
            break
        }
        if (e.pre && filename.startsWith(e.pre)) {
            let index = filename.indexOf(e.pre)
            e.index = index
            cur = e
            break
        }
    }
    return cur
}
