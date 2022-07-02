<template>
    <div class="h-1/1 flex">
        <Left ref="LeftEl">
            <niu-adjust-width :target="LeftEl"></niu-adjust-width>
        </Left>
        <div draggable="true" @dragstart="onDragStart">1</div>
    </div>
</template>
<script lang="ts" setup>
import Left from "./_ui/left.vue"
const LeftEl = ref()

function onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData("data", JSON.stringify({a: 123}))
    }
}
</script>
<style lang="less" scoped>
</style>
