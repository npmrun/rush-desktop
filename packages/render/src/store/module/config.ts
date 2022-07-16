import { defineStore } from "pinia"
import i18n from "@/i18n"

const _config: TConfig = _agent.callSync("storage.config.readConfig")

let oldConfig = ref(JSON.stringify(_config))

type TC = TConfig & {
    notSave: boolean
}

export default defineStore("config", {
    state: (): TConfig => _config,
    getters: {
        isSame(state): boolean {
            // @ts-ignore
            let nowConfig = JSON.stringify(state.$state)
            return oldConfig.value === nowConfig
        },
    },
    actions: {
        setLanguage(language: TC["language"]) {
            this.language = language
        },
        setStorePath(storagePath: TC["storagePath"]) {
            this.storagePath = storagePath
        },
        setEditorLogo(editor_logo: TC["editor_logo"]) {
            this.editor_logo = editor_logo
        },
        setBackupRule(backup_rule: TC["backup_rule"]) {
            this.backup_rule = backup_rule
        },
        async saveConfig() {
            const o: TConfig = await _agent.call("storage.config.readConfig")
            if (JSON.stringify(o) === JSON.stringify(this.$state)) {
                throw "配置文件一样，无需保存"
            }
            let rState = toRaw(this.$state)
            await _agent.call("storage.config.saveConfig", rState)
            oldConfig.value = JSON.stringify(rState)
            if (this.$state.language) {
                i18n.global.locale = this.$state.language as string
            }
        },
    },
})
