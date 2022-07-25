import mitt, { Emitter } from "mitt"
import Msg from "./Msg"

type Events = {
    "config-changed"?: TConfig
    "app-message"?: any
}

const Mitt: Emitter<Events> = mitt<Events>()

export { Mitt, Msg }
