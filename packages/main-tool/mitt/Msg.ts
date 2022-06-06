
type IName = string | number;

function Msg(name: IName, data?: any): void
function Msg(name: IName, message: string, data?: any): void
function Msg(name: IName, messageOrData?: any, data?: any): void {
    this.name = name
    if (arguments.length == 2) {
        this.data = messageOrData
    }
    if (arguments.length == 3) {
        this.message = messageOrData
        this.data = data
    }
}

function create(name: IName, data?: any): void
function create(name: IName, message: string, data?: any): void
function create(name: IName, messageOrData?: any, data?: any): void {
    return new Msg(name, messageOrData, data)
}
Msg.create = create

export default Msg
