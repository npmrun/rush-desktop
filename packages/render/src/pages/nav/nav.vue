<template>
    <div class="h-1/1 flex">
        <div class="h-1/1 w-250px min-w-100px relative" ref="LeftEl">
            <Left></Left>
        </div>
        <div class="flex-1 w-0">
            <button @click="aa">前往</button>
            <div>https://planetscale.com/</div>
            <!-- <div class="mask absolute top-0 left-0 right-0 bottom-0 bg-light-900 opacity-10"></div> -->
            <webview ref="webview" src="https://baidu.com" style="display:inline-flex; width:100%; height:480px">
            </webview>
        </div>
    </div>
</template>
<style lang="less" scoped>
</style>
<script lang="ts">
import { IState, TState } from './token';
</script>
<script lang="ts" setup>
import Left from './_ui/left.vue';
const state = reactive<TState>({
    activeKeys: [],
    list: []
})

provide(IState, state)

const webview = ref<WebviewTag>()
function aa() {
    webview.value?.loadURL("https://github.com")
}
onMounted(() => {
    console.log(webview.value);
    // webview.value?.stop()
    // webview.value?.loadURL("https://github.com")
    webview.value?.addEventListener("dom-ready", () => {
        console.log(1222);
        webview.value?.stop()
        // webview.value?.loadURL("https://github.com")
    })
})
</script>
