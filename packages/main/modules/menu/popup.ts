import { broadcast } from '@rush/main-tool'
import { ipcMain, Menu, MenuItem, webContents } from 'electron'

ipcMain.on('x_popup_menu', (e, options: IPopupMenuOption) => {
    const menu = new Menu()
    function readMenu(items: IMenuItemOption[]) {
        return items.map((opt) => {
            if (typeof opt._click_evt === 'string') {
                let evt: string = opt._click_evt
                opt.click = () => {
                    broadcast(evt)
                }
            }
            if(opt.submenu && Array.isArray(opt.submenu)){
                opt.submenu = readMenu(opt.submenu)
            }
           
            return opt
        }) 
    }
    let arrays = readMenu(options.items)

    arrays.forEach(v=>{
        const item = new MenuItem(v)
        menu.append(item)
    })
    
    menu.on('menu-will-close', (e) => {
        broadcast(`popup_menu_close:${options.menu_id}`)
    })

    menu.popup()
})
