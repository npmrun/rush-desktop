<template>
    <div class="h-1/1 flex flex-col">
        <Tabs :tabs="tabs" v-model="active"></Tabs>
        <div class="flex-1 h-0 mx-auto w-650px mt-15px text-size-18px leading-35px">
            <form action="£" @submit="onSubmit">
                <div class="flex items-center justify-center">
                    <input class="block flex-1 w-0 border leading-35px rounded-5px px-5px cursor-pointer" :value="configStore.storagePath" readonly @keydown.enter.prevent />
                    <button class="ml-10px" @click="chooseLoc">选择地址</button>
                </div>
                <div class="flex items-center justify-center mt-15px">
                    <span class="mr-15px">编辑器背景: </span>
                    <input class="block flex-1 w-0 border leading-35px rounded-5px px-5px cursor-pointer" @input="(e:any)=>configStore.setEditorLogo(e.target.value)" :value="configStore.editor_logo?configStore.editor_logo:'默认'" @keydown.enter.prevent />
                </div>
                <div :style="{ color: configStore.isSame ? '' : 'red' }" class="float-right mt-15px">
                    <button class="border rounded-5px px-15px text-size-16px py-8px" @click="save" type="submit">保存</button>
                </div>
            </form>
        </div>
        <img class="hidden" src="rush-file://1111.jpg">
    </div>
</template>
<script lang="ts" setup>
import ConfigStore from "@/store/module/config"
import Toastify from "toastify-js";

function click() {
    Toastify({
        text: "请选择路径",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

const configStore = ConfigStore()
function onSubmit(e: Event) {
    e.preventDefault()
    return false
}
async function chooseLoc() {
    try {
        const newPath = await _agent.callLong("dialog.chooseDir", configStore.storagePath)
        console.log(newPath)
        configStore.setStorePath(newPath)
    } catch (error) {
        console.log(error)
    }
}

async function save() {
    try {
        await configStore.saveConfig()
        console.log("保存成功")
    } catch (e) {
        console.log(e)
    }
}

const active = ref(0)
const activeBg = computed(() => {
    return tabs[active.value].bg
})
const tabs = shallowReactive([
    {
        key: 0,
        color: "white",
        bg: "#d1ba74",
        label: "通用选项",
    },
])
</script>
<script lang="ts">
export default defineComponent({
    name: "",
})
</script>

<style lang="less" scoped></style>
