import { BrowserWindow, ipcMain, app } from 'electron'
import { NsisUpdater, ProgressInfo, UpdateInfo } from 'electron-updater'
import setting from '@rush/share/setting'

export default (window: BrowserWindow): void => {
  if(!app.isPackaged) return
  // 实例化 autoUpdater
  const autoUpdater = new NsisUpdater({
    provider: 'generic',
    // url: 'http://update.xieyaxin.top/electron',
    url: 'https://media.githubusercontent.com/media/npmrun/rush-desktop/develop/out/',
    channel: setting.app_version.includes("beta")? 'beta' : 'latest'
  })

  // 开始检查更新
  autoUpdater.on('checking-for-update', () => {
    window.webContents.send("checking-for-update", {
      message: '开始检查更新'
    })
  })

  // 检查更新出错
  autoUpdater.on('error', () => {
    window.webContents.send("updater:error", {
      message: '检查更新出错'
    })
  })

  // 检查到新版本
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    window.webContents.send("updater:avaliable", {
      message: `检查到新版本 v ${info.version}，开始下载`
    })
  })

  // 已经是新版本
  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    window.webContents.send("updater:notavaliable", {
      message: `当前版本已经是最新 v ${info.version}`
    })
  })

  // 更新下载中
  autoUpdater.on('download-progress', (info: ProgressInfo) => {
    window.webContents.send("updater:download_progress", {
      percent: info.percent
    })
  })

  // 更新下载完毕
  autoUpdater.on('update-downloaded', () => {
    window.webContents.send("updater:downloaded", {
      message: '新版本下载完毕,点击安装'
    })
  })

  // 立即更新
  ipcMain.on("updater:quitandinstall", () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on("updater:check", () => {
    autoUpdater.checkForUpdatesAndNotify()
  })
  autoUpdater.checkForUpdatesAndNotify()
}
