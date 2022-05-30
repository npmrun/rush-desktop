import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
console.log(messages);

const i18n = createI18n({
    legacy: true,
    locale: "zh",
    messages: messages,
})

export default i18n