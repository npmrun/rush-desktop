import "virtual:windi.css"
import "virtual:windi-devtools"
import "virtual:svg-icons-register"
import "toastify-js/src/toastify.css"
import "@/assets/style/common.less"

import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"
import pinia from "@/store"
import i18n from "@/i18n"
import directive from "@/directive"

const app = createApp(App)
app.use(directive)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount("#app")
