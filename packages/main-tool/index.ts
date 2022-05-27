export function getFileUrl(app: string = "", route: string = "") {
    const winURL =
        process.env.NODE_ENV === "development"
            ? `http://localhost:${process.env.PORT}/${app}#/${route}`
            : `file://${__dirname}/${app}#/${route}`
    return winURL
}
