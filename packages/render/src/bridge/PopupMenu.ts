/**
 * ContextMenu
 * @author: oldj
 * @homepage: https://oldj.net
 */

let _idx: number = 0

type OffFunction = () => void

export class PopupMenu {
    private _id: string
    private _items: IMenuItemOption[]
    private _offs: any[] = []

    constructor(menu_items: IMenuItemOption[]) {
        this._id = `popup_menu_${Math.floor(Math.random() * 1e8)}`
        this._items = menu_items
    }

    show() {
        // console.log('show')
        this.onHide()
        let that = this
        function readMenu(_items: IMenuItemOption[]) {
            return _items.map((i) => {
                let d = { ...i }
                if (typeof d.click === 'function') {
                    const r = Math.floor(Math.random() * 1e8)
                    const evt = `popup_menu_item_${_idx++}_${r}`
                    let off = _agent.once(evt, d.click as any)
                    that._offs.push(off)
                    d._click_evt = evt
                    delete d.click
                }
                if(d.submenu && Array.isArray(d.submenu)){
                    d.submenu = readMenu(d.submenu)
                }
                return d
            })
        }
        let items = readMenu(this._items)

        _agent.popupMenu({
            menu_id: this._id,
            items,
        })
            ; ((offs: OffFunction[]) => {
                _agent.once(`popup_menu_close:${this._id}`, () => {
                    // console.log(`on popup_menu_close:${this._id}`)
                    setTimeout(() => {
                        offs.map((o) => o())
                    }, 100)
                })
            })(this._offs)
    }

    private onHide() {
        // console.log('hide...')
        this._offs.map((o) => o())
        this._offs = []
    }
}
