<template>
    <div class="h-1/1 flex flex-col">
        <Tabs :tabs="tabs" v-model="active"></Tabs>
        <div class="flex-1 h-0 content">
            {{activeBg}}
            <input type="text" v-model="state.backup_rule.value">
        </div>
    </div>
</template>
<script lang="ts" setup>
import ConfigStore from "@/store/module/config"
import { storeToRefs } from 'pinia'

const configStore = ConfigStore()
const state = storeToRefs(configStore)
console.log(state)

const text = ref(`const a = 123`)
const active = ref(0)
const activeBg = computed(()=>{
    return tabs[active.value].bg
})
const tabs = shallowReactive([
    {
        key: 0,
        color: "white",
        bg: "#d1ba74",
        label: "通用选项1"
    },
    {
        key: 1,
        color: "white",
        bg: "#f4606c",
        label: "通用"
    },
    {
        key: 2,
        color: "white",
        bg: "#19caad",
        label: "外观"
    },
])
</script>
<script lang="ts">
export default defineComponent({
    name: ""
})
</script>

<style lang="less" scoped>
.content{
    // transition: background .3s ease-in-out;
    // background-color: v-bind(activeBg);
}   
</style>
