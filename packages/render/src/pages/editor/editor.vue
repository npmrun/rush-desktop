<template>
    <div class="h-1/1 flex">
        <div class="w-0 relative flex-grow">
            <CodeEditor v-model="code" name="a.ts" :logo="(configStore.editor_logo as string)"></CodeEditor>
            <niu-adjust-width :target="targetEl"></niu-adjust-width>
        </div>
        <div ref="targetEl" class="w-250px flex flex-col border-l">
            <div class="flex-1 h-0">{{ code }}</div>
            <div class="border-t">Console</div>
        </div>
    </div>
</template>
<style lang="less" scoped>
</style>
<script lang="ts" setup>
import CodeEditor from '@/components/CodeEditor/CodeEditor.vue';
import ConfigStore from "@/store/module/config"

const targetEl = ref()

const configStore = ConfigStore()
const code = ref("")
</script>
