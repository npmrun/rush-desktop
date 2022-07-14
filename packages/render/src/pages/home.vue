<template>
    <div class="m-25px">
        <div @click="click"
            class="w-150px h-150px flex items-center justify-center mx-auto shadow rounded-1/2 bg-blue-400 active:bg-blue-300 text-size-25px text-white cursor-pointer">
            {{ statusText }}</div>
        <div class="text-center my-20px cursor-pointer" @click="choose">
            <button v-if="!chooseDir" class="px-15px py-8px border rounded-5px text-size-12px">选择文件夹</button>
            <div class="text-gray-500">
                {{ chooseDir }}
            </div>
        </div>
        <div v-if="!!messages.length"
            class="border py-6px px-5px max-h-200px overflow-auto min-w-350px max-w-350px mx-auto leading-4 rounded-5px">
            <div v-for="(item, index) in messages" :key="index">{{ item }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { EProcessStatus } from '@rush/common/process';

const messages = ref<any[]>([])
onBeforeMount(() => {
    (async () => {
        const res = await _agent.call("process.getProcess", "live")
        if (res) {
            console.log(res);
            let array = res.command.split(" ")
            chooseDir.value = array[array.length - 1]
            messages.value = res.log
            status.value = res.status
        }
    })()
    _agent.on("event:process", (ev, data: any) => {
        // if (data.key === "live") {
            status.value = data.status
            if (data.message) {
                if (data.status === "exit") data.message = "退出码: " + data.message
                messages.value.push(data.message)
            }
        // }
    })
})
onBeforeUnmount(() => {
    _agent.call("process.kill", "live")
    _agent.offAll("event:process")
})
const chooseDir = ref()
async function choose() {
    if (status.value === EProcessStatus.Normal || status.value === EProcessStatus.Exit) {
        const res = await _agent.callLong("dialog.chooseDir", "选择一个文件夹")
        chooseDir.value = res
    } else {
        console.log("进程运行中，暂时无法选择");
    }
}

const status = ref<EProcessStatus>(EProcessStatus.Normal)
const statusText = computed(() => {
    if (status.value === EProcessStatus.Normal) return "开启"
    if (status.value === EProcessStatus.Starting) return "开启中"
    if (status.value === EProcessStatus.Running) return "运行中"
    if (status.value === EProcessStatus.Stopping) return "关闭中"
    if (status.value === EProcessStatus.Exit) return "已关闭"
})
let isExecing = false
async function click() {
    if (!chooseDir.value) return
    if (isExecing) return
    isExecing = true
    try {
        if (status.value === EProcessStatus.Normal || status.value === EProcessStatus.Exit) {
            await _agent.call("process.createProcess", "live", "live-server -q --port=3333 " + chooseDir.value)
        } else if (status.value === EProcessStatus.Running) {
            await _agent.call("process.kill", "live")
        }
        isExecing = false
    } catch (error) {
        console.error(error);
        isExecing = false
    }
}
</script>

<style lang="less" scoped>
.home {
    @apply bg-white;
}
</style>
