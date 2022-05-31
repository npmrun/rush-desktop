<template>
    <div>
        <textarea class="w-1/1" name="" id="" cols="30" rows="10" v-model="msg"></textarea>
    </div>
</template>
<script lang="ts" setup>
// 顶部区块START
const msg = ref(`await _agent.call("process.createProcess", "live", "live-server --port=3333 D:/1XYX/work/manager-pc/dist/")
await _agent.call("process.killAll")
await _agent.call("process.getList")`)
// 顶部区块END
</script>
<script lang="ts">
export default defineComponent({
    name: ""
})
</script>

<style lang="less" scoped>
.home {
    @apply bg-white;
}
</style>
