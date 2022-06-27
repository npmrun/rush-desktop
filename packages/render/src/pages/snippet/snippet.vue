<template>
    <div class="h-1/1">
        <div class="w-250px bg-light-600 h-1/1">
            <filetree :list="list" @clickNode="handleClickNode" v-model:activeKeys="activeKeys"
                v-model:openKey="openKey" v-model:isFocus="isFocus" @contextmenu="onContextmenu"
                @itemDragover="onDragover" @itemDragleave="onDragleave" @itemDrop="onDrop"></filetree>
            <div draggable="true">sda</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PopupMenu } from "@/bridge/PopupMenu";
import { convert, convertTreeData, INiuTreeData, INiuTreeKey } from "princess-ui"
import { v4 } from "uuid"
import filetree from "./_ui/filetree.vue"

const openKey = ref<INiuTreeKey>()
const activeKeys = ref<INiuTreeKey[]>([])
const isFocus = ref<boolean>(false)
/**
 * 树形结构右键菜单
 * @param e 节点数据
 */
function onContextmenu(e: INiuTreeData) {
    const menuList: IMenuItemOption[] = [
        { 
            label: "测试",
            submenu: [
                {
                    label: "aaa",
                    click(a, b){

                    }
                }
            ]
        }
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}
/**
 * 当拖拽元素在该元素之上
 * @param ev 拖住事件
 * @param active 是否应用激活样式
 */
function onDragover(ev: DragEvent, active: (status: boolean) => void) {
    console.log("onDragover")
    active(true)
}
/**
 * 当拖拽元素在离开该元素
 * @param ev 拖住事件
 * @param active 是否应用激活样式
 */
function onDragleave(ev: DragEvent, active: (status: boolean) => void) {
    console.log("onDragleave")
    active(false)
}
/**
 * 当拖拽元素释放在该元素
 * @param ev 拖住事件
 * @param active 是否应用激活样式
 */
function onDrop(ev: DragEvent, active: (status: boolean) => void) {
    console.log("onDrop")
    active(false)
}
/**
 * 处理节点文本区域点击事件
 * @param data 节点数据
 */
function handleClickNode(data: INiuTreeData) {
    openKey.value = data.key
    activeKeys.value = [data.key]
    data.children?.push(convert({
        key: v4(),
        title: "5",
        children: [],
    }))
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
<style lang="less" scoped>
</style>
