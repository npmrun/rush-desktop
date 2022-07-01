<template>
    <div class="h-1/1">
        <CodeEditor name="index.ts" v-model="text"></CodeEditor>
    </div>
</template>
<script lang="ts" setup>
import CodeEditor from '@/components/CodeEditor/CodeEditor.vue';
const text = ref(`const a = 123`)

</script>
<script lang="ts">
export default defineComponent({
    name: ""
})
</script>

<style lang="less" scoped>
</style>
