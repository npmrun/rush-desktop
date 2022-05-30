import mitt, { Emitter } from "mitt"
import Msg from "./Msg"
export enum EType {
    log,
    data,
}

type Events = {
    "event:process": { type: EType; data: any; message: string }
}

const Fire: Emitter<Events> = mitt<Events>()

export { Fire, Msg, ConfigEvent }

type ConfigEvent = {
    "config-changed": TConfig
}
const ConfigEvent: Emitter<ConfigEvent> = mitt<ConfigEvent>()
