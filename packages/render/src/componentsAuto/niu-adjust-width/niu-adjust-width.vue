<template>
    <div
        class="adjust-line"
        :class="['adjust-line__' + direction]"
        ref="adjustLineEL"
    ></div>
</template>

<style lang="less" scoped>
.adjust-line {
    position: absolute;
    z-index: 99;
    top: 0;
    bottom: 0;
    width: 4px;
    transition: background-color 0.5s ease;
    cursor: ew-resize;
    &:hover,
    &:active {
        background: #1976d2;
    }

    &__left {
        left: -2px;
    }

    &__right {
        right: -2px;
    }
}
</style>

<script lang="ts" setup>
const adjustLineEL = ref<HTMLElement>()

const props = withDefaults(
    defineProps<{
        direction?: 'left' | 'right'
        target?: HTMLElement
        mid?: string
    }>(),
    {
        direction: 'right',
    }
)

watch(
    () => props.target,
    (target) => {
        if (!adjustLineEL.value) return
        const nextContainer = target
        const el = adjustLineEL.value
        const container = el.parentElement
        if (nextContainer && el && container) {
            if (props.mid) {
                let w = localStorage.getItem(props.mid)
                if (w != undefined) {
                    container.style.width = w + 'px'
                }
            }
            el.onmousedown = function (e) {
                let width = container.clientWidth
                let nwidth = nextContainer.clientWidth
                let owidth = nwidth + width

                let startX = e.clientX

                let lastPointerEvents = document.body.style.pointerEvents
                let lastUserSelect = document.body.style.userSelect
                let lastOnmousemove = document.onmousemove
                let lastOnmouseup = document.onmouseup

                document.onmousemove = function (e) {
                    let nowX = e.clientX
                    let w = 0
                    if (props.direction == 'left') {
                        w = width + startX - nowX
                    }
                    if (props.direction == 'right') {
                        w = width + nowX - startX
                    }
                    if (Math.abs(w - owidth / 2) <= 15) {
                        w = owidth / 2
                    }
                    if (w >= owidth) {
                        w = owidth
                    }
                    if (w <= 0) {
                        w = 0
                    }
                    if (Math.abs(w - owidth) < 50) {
                        w = owidth
                    }
                    if (Math.abs(w) < 50) {
                        w = 0
                    }
                    document.body.style.pointerEvents = 'none'
                    document.body.style.userSelect = 'none'
                    if(container===nextContainer){
                        container.style.width = w + 'px'
                        // container.style.minWidth = w + 'px'
                        container.style.flexBasis = w + 'px'
                    }else{
                        nextContainer.style.width = (owidth-w) + 'px'
                        // nextContainer.style.minWidth = (owidth-w) + 'px'
                        nextContainer.style.flexBasis = (owidth-w) + 'px'
                    }
                }
                document.onmouseup = function (e) {
                    document.onmousemove = lastOnmousemove
                    document.onmouseup = lastOnmouseup
                    document.body.style.pointerEvents = lastPointerEvents
                    document.body.style.userSelect = lastUserSelect
                    if (props.mid) {
                        let width = container.clientWidth
                        localStorage.setItem(props.mid, String(width))
                    }
                }
            }
        }
    }
)

// onMounted(() => {
//     if (adjustLineEL.value) {
//         let el = adjustLineEL.value as HTMLElement
//         let container = el.parentElement as HTMLElement
//         let parentContainer = el.parentElement!.parentElement as HTMLElement
//         el.onmousedown = function (e) {
//             let owidth = parentContainer.clientWidth
//             let width = container.clientWidth
//             let startX = e.clientX
//             document.onmousemove = function (e) {
//                 let nowX = e.clientX
//                 let w = 0
//                 if(props.direction == "left"){
//                     w = width + startX - nowX
//                 }
//                 if(props.direction == "right"){
//                     w = width + nowX - startX
//                 }
//                 if (Math.abs(w - owidth / 2) <= 5) {
//                     w = owidth / 2
//                 }
//                 parentContainer.style.pointerEvents = "none"
//                 container.style.width = (w / owidth) * 100 + "%"
//             }
//             document.onmouseup = function (e) {
//                 document.onmousemove = null
//                 document.onmouseup = null
//                 parentContainer.style.pointerEvents = "auto"
//             }
//         }
//     }
// })
</script>
