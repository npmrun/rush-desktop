import { webContents } from 'electron'

export const broadcast = (event: string, ...args: any[]) => {
    webContents
        .getAllWebContents()
        .forEach((browser) => browser.send(event, ...args))
}
