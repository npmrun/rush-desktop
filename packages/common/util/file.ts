export function judgeFile(filename: string) {
    if (!filename) return
    let ext = [
        { language: 'vue', ext: '.vue', index: -1 },
        { language: 'javascript', ext: '.js', index: -1 },
        { language: 'css', ext: '.css', index: -1 },
        { language: 'html', ext: '.html', index: -1 },
        { language: 'tsx', ext: '.tsx', index: -1 },
        { language: 'typescript', ext: '.ts', index: -1 },
        { language: 'markdown', ext: '.md', index: -1 },
        { language: 'dot', pre: '.', index: -1 },
    ]
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
