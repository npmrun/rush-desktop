<template>
    <div class="h-1/1 flex">
        <div class="w-0 relative flex-grow">
            <CodeEditor v-model="code" name="a.ts" :logo="(configStore.editor_logo as string)"></CodeEditor>
            <niu-adjust-width :target="targetEl"></niu-adjust-width>
        </div>
        <div ref="targetEl" class="w-1/2 flex flex-col border-l">
            <div class="h-3/5" ref="topEl">
                {{code}}
            </div>
            <div class="border-t scrollbar relative flex-grow h-0 p-5px" style="background-color: #fafafa;">
                <xterm></xterm>  
                <niu-adjust-width :target="topEl" direction="top"></niu-adjust-width>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
</style>
<script lang="ts" setup>
import CodeEditor from '@/components/CodeEditor/CodeEditor.vue';
import xterm from '@/components/xterm/xterm.vue';
import ConfigStore from "@/store/module/config"

const targetEl = ref()
const topEl = ref()

const configStore = ConfigStore()
const code = ref("")
</script>
