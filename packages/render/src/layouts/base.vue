<template>
    <div class="h-1/1 flex flex-col">
        <div class="layout">
            <div class="left" v-if="route.meta.activebar === undefined || route.meta.activebar">
                <actions-bar></actions-bar>
            </div>
            <div class="right">
                <router-view v-slot="{ Component, route: route }">
                    <transition :name="getTransitionName(route)" mode="out-in" appear>
                        <keep-alive :include="cacheList">
                            <component :key="route.fullPath" :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
            <!-- <float-button>首页{{$t("title")}}</float-button> -->

        </div>
        <!-- <div class="bottom">
            <div class="bottom-item">{{ route.fullPath }}
            </div>
            <div class="bottom-item right" title="english">en
            </div>
        </div> -->
    </div>
</template>

<style lang="less" scoped>
.bottom {
    @apply h-25px leading-25px flex;
    background-color: #007acc;
    color: white;

    .bottom-item {
        @apply inline-block hover: bg-light-500 hover:bg-opacity-20 cursor-pointer px-10px;

        &.right {
            @apply ml-auto;
        }
    }
}

.layout {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;

    .left {}

    .right {
        flex: 1;
        width: 0;
    }
}
</style>

<script lang="ts" setup>
import actionsBar from './_ui/actions-bar.vue';
import pageStore from '@/store/module/page'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
const route = useRoute()
const store = pageStore()

const cacheList = store.cache
watch(
    () => route.fullPath,
    () => {
        if (route.meta.cache && route.name) {
            store.addCacheView(route.name as string)
        }
        route.meta.title && useTitle(route.meta.title as string)
    },
    {
        immediate: true,
    }
)

function getTransitionName(route: RouteLocationNormalizedLoaded) {
    return 'fade'
}
</script>
<script lang="ts">
export default defineComponent({
    name: 'BaseLayout',
})
</script>

