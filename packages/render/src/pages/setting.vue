<template>
    <div class="h-1/1">
        <editor name="index.ts" v-model="text"></editor>
    </div>
</template>
<script lang="ts" setup>
import editor from '@/components/editor/editor.vue';
const text = ref(`const a = 123`)

</script>
<script lang="ts">
export default defineComponent({
    name: ""
})
</script>

<style lang="less" scoped>
</style>
