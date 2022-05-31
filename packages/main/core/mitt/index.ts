import mitt, { Emitter } from "mitt"
import Msg from "./Msg"
export enum EType {
    log,
    data,
}

type Events = {
    "event:process": { type: EType; data: any; message: string }
    "config-changed"?: TConfig
}

const Mitt: Emitter<Events> = mitt<Events>()

export { Mitt, Msg }
