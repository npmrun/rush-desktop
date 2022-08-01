import { mainConfig } from "@rush/main-config"

export async function keys(key) {
    return mainConfig[key]
}
