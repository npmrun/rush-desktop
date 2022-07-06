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
        <div class="bottom">
            <div class="bottom-item">{{ route.fullPath }}
            </div>
            <div class="right">
                <div class="bottom-item">chrome: {{agent.info.chrome}}</div>
                <div class="bottom-item">node: {{agent.info.node}}</div>
                <div class="bottom-item">electron: {{agent.info.electron}}</div>
                <div class="bottom-item" @click="onCheck">{{updater_text}}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.bottom {
    @apply h-25px leading-25px;
    background-color: #007acc;
    color: white;
    .right {
        float: right
    }
    .bottom-item {
        @apply inline-block hover: bg-light-500 hover:bg-opacity-20 cursor-pointer px-10px;
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

const agent: any = _agent

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
enum EStatus {
    normal,
    checking,
    waitForInstall
}
const updater_text = ref("更新")
const status = ref<EStatus>(EStatus.normal)
function onCheck() {
    if (status.value === EStatus.checking) return
    if (status.value === EStatus.normal) {
        _agent.send("updater:check")
    }
    if (status.value === EStatus.waitForInstall) {
        _agent.send("updater:quitandinstall")
    }
}
_agent.on("checking-for-update", ((event, res:any) => {
    updater_text.value = res.message
    status.value = EStatus.checking
}))
_agent.on("updater:error", ((event, res:any) => {
    updater_text.value = res.message
    status.value = EStatus.normal
}))
_agent.on("updater:avaliable", ((event, res:any) => {
    updater_text.value = res.message
    status.value = EStatus.checking
}))
_agent.on("updater:notavaliable", ((event, res:any) => {
    updater_text.value = res.message
    status.value = EStatus.normal
}))
_agent.on("updater:download_progress", ((event, res:any) => {
    updater_text.value = `当前下载进度${(+res.percent).toFixed(2)}%`
    status.value = EStatus.checking
}))
_agent.on("updater:downloaded", ((event, res:any) => {
    updater_text.value = res.message
    status.value = EStatus.waitForInstall
}))
</script>
<script lang="ts">
export default defineComponent({
    name: 'BaseLayout',
})
</script>

