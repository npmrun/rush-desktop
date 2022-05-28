import mitt, { Emitter } from "mitt"

enum EType {
    log,
    data,
}
type Events = {
    "event:process": { type: EType; data: any; message: string }
}

function Msg(type: EType, data?: any): void
function Msg(type: EType, message: string, data?: any): void
function Msg(type: EType, messageOrData?: any, data?: any): void {
    this.type = type
    if (arguments.length == 2) {
        this.data = messageOrData
    }
    if (arguments.length == 3) {
        this.message = messageOrData
        this.data = data
    }
}

function create(type: EType, data?: any): void
function create(type: EType, message: string, data?: any): void
function create(type: EType, messageOrData?: any, data?: any): void {
    return new Msg(type, messageOrData, data)
}
Msg.create = create

const Fire: Emitter<Events> = mitt<Events>()

export { Fire, Msg }
