<template>
    <div ref="elRef" class="niu-scrollbar component">
        <div ref="scrollWrapperRef" class="niu-scrollbar__wrapper niu-scrollbar--none" @mousewheel="handleScroll">
            <div ref="scrollRef" class="niu-scrollbar__inner">
                <slot></slot>
            </div>
            <div class="niu-scrollbar__bar__wrapper" v-if="showBar">
                <div ref="scrollbarRef" class="niu-scrollbar__bar"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
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
    console.log(rate);

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
onUpdated(async () => {
    await nextTick()
    check()
})
</script>

<style lang="less" scoped>
.niu-scrollbar.component {
    position: relative;

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
                display: block;
            }
        }
    }

    .niu-scrollbar__bar__wrapper {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background-color: rgba(255, 0, 0, 0.199);

        .niu-scrollbar__bar {
            cursor: pointer;
            height: 100%;
            width: 0;
            background-color: aqua;
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
