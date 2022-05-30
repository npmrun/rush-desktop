import { defineStore } from "pinia"

export default defineStore("page", {
    state: (): { _cache: string[] } => ({
        _cache: [],
    }),
    getters: {
        cache: state => state._cache,
    },
    actions: {
        addCacheView(name: string) {
            if (!this._cache.includes(name)) {
                this._cache.push(name)
            }
        },
        removeCacheView(name: string) {
            let index = this.cache.indexOf(name)
            if (index > -1) {
                this._cache.splice(index, 1)
            }
        },
    },
})
