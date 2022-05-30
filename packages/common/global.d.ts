interface IMenuItemOption extends Electron.MenuItemConstructorOptions {
    // 参见：https://www.electronjs.org/docs/api/menu-item

    _click_evt?: string
}

interface IPopupMenuOption {
    menu_id: string
    items: IMenuItemOption[]
}

type TConfig = {
    language: "zh" | "en"
    backup_rule: string
    get storagePath(): string
    set storagePath(value: string)
}
