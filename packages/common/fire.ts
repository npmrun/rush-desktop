type FireKey = string
type FireFN = (...argu: any[]) => void

class FireEvent {
    #events: Record<FireKey, FireFN[]> = {}
    print() {
        Object.keys(this.#events).forEach(key => {
            console.log(`${key}: ${this.#events[key]}\n`)
        })
    }
    on(name: FireKey, fn: FireFN) {
        if (!this.#events[name]) {
            this.#events[name] = []
        }
        this.#events[name].push(fn)
    }
    emit(name: FireKey, ...argu: any[]) {
        if (this.#events[name]) {
            this.#events[name].forEach(fn => {
                fn(name, ...argu)
            })
        }
    }
    off(name: FireKey, fn?: FireFN) {
        const len = this.#events[name].length
        if (!len) {
            return
        }
        if (!fn) {
            this.#events[name] = []
        } else {
            for (let i = len - 1; i >= 0; i--) {
                const _fn = this.#events[name][i]
                if (_fn === fn) {
                    this.#events[name].splice(i, 1)
                }
            }
        }
    }
    once(name: FireKey, fn: FireFN) {
        const _fn = (...argu: any[]) => {
            fn(...argu)
            this.off(name, _fn)
        }
        this.on(name, _fn)
    }
}

const fire = new FireEvent()
fire.once("aaa", function (name, value) {
    console.log(name, value)
})
fire.emit("aaa", 123)
fire.emit("aaa", 123)

fire.print()
