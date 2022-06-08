<template>
    <div ref="elRef" class="niu-scrollbar component">
        <div ref="scrollWrapperRef" :class="{ dragging: isDragging }" class="niu-scrollbar__wrapper niu-scrollbar--none"
            @mousewheel="handleScroll">
            <div ref="scrollRef" class="niu-scrollbar__inner">
                <slot></slot>
            </div>
            <div class="niu-scrollbar__bar__wrapper" v-if="showBar">
                <div ref="scrollbarRef" class="niu-scrollbar__bar" @mousedown="handleTouchStart"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const isDragging = ref(false)
let startX: number | void = undefined
let scrollLeft: number | void = undefined
let oldMouseMove: any
let oldMouseUp: any
function handleTouchStart(e: MouseEvent) {
    startX = e.clientX
    scrollLeft = scrollWrapperRef.value?.scrollLeft ?? 0
    oldMouseMove = document.onmousemove
    oldMouseUp = document.onmouseup
    isDragging.value = true
    document.onmousemove = function (e: MouseEvent) {
        if (startX === undefined) return
        isDragging.value = true
        if (scrollbarRef.value && scrollWrapperRef.value && scrollRef.value && scrollLeft != undefined) {
            let moveX = scrollLeft + e.clientX - startX
            const totalWidth = scrollRef.value?.offsetWidth ?? 0
            if (moveX < 0) moveX = 0
            if (moveX > totalWidth - scrollWrapperRef.value.offsetWidth) moveX = totalWidth - scrollWrapperRef.value.offsetWidth
            scrollWrapperRef.value.scrollLeft = moveX
            scrollbarRef.value.style.marginLeft = ((moveX / totalWidth) * 100) + '%'
        }
    }
    document.onmouseup = function (e: MouseEvent) {
        isDragging.value = false
        startX = undefined
        document.onmousemove = oldMouseMove
        document.onmouseup = oldMouseUp
    }
}

function handleScroll(e: any) {
    var scrollNum = e.currentTarget as HTMLDivElement
    //deltaY属性在向下滚动时返回正值，向上滚动时返回负值，否则为0
    scrollNum.scrollLeft = scrollNum.scrollLeft + e.deltaY
    const totalWidth = scrollRef.value?.offsetWidth ?? 0
    if (scrollbarRef.value) {
        scrollbarRef.value.style.marginLeft = ((scrollNum.scrollLeft / totalWidth) * 100) + '%'
    }
}

const elRef = ref<HTMLDivElement>()
const scrollWrapperRef = ref<HTMLDivElement>()
const scrollRef = ref<HTMLDivElement>()
const scrollbarRef = ref<HTMLDivElement>()

const showBar = ref(false)
async function check() {
    const scrollWrapperWidth = scrollWrapperRef.value?.offsetWidth ?? 0
    const totalWidth = scrollRef.value?.offsetWidth ?? 0
    let rate = 0
    if (scrollWrapperWidth != 0) {
        rate = scrollWrapperWidth / totalWidth
    }
    if (rate < 1) {
        showBar.value = true
    } else {
        showBar.value = false
    }
    if (showBar.value) {
        await nextTick()
        if (scrollbarRef.value && scrollWrapperRef.value) {
            scrollbarRef.value.style.width = 100 * rate + '%'
            scrollbarRef.value.style.marginLeft = ((scrollWrapperRef.value.scrollLeft / totalWidth) * 100) + '%'
        }
    }
}
useResizeObserver(elRef, async () => {
    await nextTick()
    check()
})
onMounted(() => {
    check()
})
</script>

<style lang="less" scoped>
.niu-scrollbar.component {
    position: relative;
    overflow: hidden;
    .niu-scrollbar__wrapper {
        &::after {
            clear: both;
            content: '.';
            display: block;
            height: 0;
            line-height: 0;
            overflow: hidden;
        }

        overflow: auto;

        .niu-scrollbar__inner {
            float: left;
        }

        &:hover {
            .niu-scrollbar__bar__wrapper {
                bottom: 0;
            }
        }

        &.dragging {
            .niu-scrollbar__bar__wrapper {
                bottom: 0;
            }
        }
    }

    .niu-scrollbar__bar__wrapper {
        // display: none;
        position: absolute;
        transition: bottom .2s linear;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 4px;
        .niu-scrollbar__bar {
            cursor: pointer;
            height: 100%;
            width: 0;
            background-color: #7c7c7c8a;
        }
    }
}

.niu-scrollbar--none::-webkit-scrollbar {
    display: none;
}

.niu-scrollbar--none {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
