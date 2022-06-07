<template>
    <div class="h-1/1 flex flex-col">
        <Tabs :tabs="tabs" v-model="active"></Tabs>
        <div class="flex-1 h-0">
            asd
        </div>
        <!-- <editor name="index.ts" v-model="text"></editor> -->
    </div>
</template>
<script lang="ts" setup>
import editor from '@/components/editor/editor.vue';
const text = ref(`const a = 123`)
const active = ref(0)
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

</style>
