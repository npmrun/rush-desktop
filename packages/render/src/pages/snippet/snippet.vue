<template>
    <div class="h-1/1">
        <div class="w-250px bg-light-600 h-1/1">
            <filetree
                :list="list"
                @clickNode="handleClickNode"
                v-model:activeKeys="activeKeys"
                v-model:openKey="openKey"
                v-model:isFocus="isFocus"
                @contextmenu="onContextmenu"
                @itemDragover="onDragover"
                @itemDragleave="onDragleave"
                @itemDrop="onDrop"
            ></filetree>
            <div draggable="true">sda</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { convertTreeData, INiuTreeData, INiuTreeKey } from "princess-ui"
import { v4 } from "uuid"
import filetree from "./_ui/filetree.vue"

const openKey = ref<INiuTreeKey>()
const activeKeys = ref<INiuTreeKey[]>([])
const isFocus = ref<boolean>(false)

function onContextmenu() {
    console.log("232")
}
function onDragover(ev: DragEvent, active: (status: boolean) => void) {
    console.log("onDragover")
    active(true)
}
function onDragleave(ev: DragEvent, active: (status: boolean) => void) {
    console.log("onDragleave")
    active(false)
}
function onDrop(ev: DragEvent, active: (status: boolean) => void) {
    console.log("onDrop")
    active(false)
}
function handleClickNode(data: INiuTreeData) {
    openKey.value = data.key
    activeKeys.value = [data.key]
}

const list = ref(
    convertTreeData([
        {
            key: v4(),
            title: "1",
            children: [],
        },
        {
            key: v4(),
            title: "2",
            children: [],
        },
        {
            key: v4(),
            title: "3",
            children: [],
        },
    ]),
)
</script>
<style lang="less" scoped></style>
