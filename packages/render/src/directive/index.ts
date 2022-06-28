import { App, ref } from 'vue'
import loading from './Loading'

export default {
    install(app: App) {
        app.use(loading)
    },
}
