interface IFile {
    language: string
    ext?: string
    pre?: string
    index?: number
}

const files: IFile[] = [
    { language: "vue", ext: ".vue" },
    { language: "scss", ext: ".scss" },
    { language: "sass", ext: ".sass" },
    { language: "less", ext: ".less" },
    { language: "java", ext: ".java" },
    { language: "javascript", ext: ".js" },
    { language: "css", ext: ".css" },
    { language: "html", ext: ".html" },
    { language: "tsx", ext: ".tsx" },
    { language: "jsx", ext: ".jsx" },
    { language: "typescript", ext: ".ts" },
    { language: "markdown", ext: ".md" },
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
    const index = filename.lastIndexOf('.')
    if(!cur && index!=-1 && filename[0]!='.'){
        cur = { language: filename.slice(index+1), ext: filename.slice(index), index: index }
    }
    return cur
}
