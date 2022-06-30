<template>
    <div class="h-1/1">
        <div class="w-250px h-1/1" v-loading="isLoading">
            <div class="h-1/1 py-5px bg-light-600 relative" @contextmenu="onGlobalContextmenu">
                <filetree :dropFn="dropFn" :list="list" @clickNode="handleClickNode" v-model:activeKeys="activeKeys"
                    v-model:openKey="openKey" v-model:focusKey="focusKey" v-model:isFocus="isFocus"
                    @contextmenu="onContextmenu" @itemDragover="onDragover" @rename="handleRename"
                    @itemDragleave="onDragleave" @itemDrop="onDrop" @create-one="handleCreateOne"></filetree>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PopupMenu } from "@/bridge/PopupMenu";
import { convert, convertTreeData, ENiuTreeStatus, findByKey, INiuTreeData, INiuTreeKey, removeByKey } from "princess-ui"
import { v4 } from "uuid"
import filetree from "./_ui/filetree.vue"

const isLoading = ref(false)
const openKey = ref<INiuTreeKey>()
const activeKeys = ref<INiuTreeKey[]>([])
const focusKey = ref<INiuTreeKey>()
const isFocus = ref<boolean>(false)
function onGlobalContextmenu(e: MouseEvent) {
    e.stopPropagation()
    const menuList: IMenuItemOption[] = [
        {
            label: "新建文件夹",
            click() {
                list.value?.push(convert({
                    key: v4(),
                    title: "",
                    isNew: true,
                    isEdit: true,
                    children: [],
                }))
            }
        },
        {
            label: "新建文件",
            click() {
                list.value?.push(convert({
                    key: v4(),
                    title: "",
                    isNew: true,
                    isEdit: true,
                }))
            }
        },
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}
/**
 * 树形结构右键菜单
 * @param e 节点数据
 */
function onContextmenu(data: INiuTreeData) {
    const menuList: IMenuItemOption[] = [
        {
            label: "重命名",
            click() {
                data.isEdit = true
            }
        },
        {
            label: "新建文件夹",
            click() {
                data.isFolder && (data.isExpand = true)
                data.children?.push(convert({
                    key: v4(),
                    title: "",
                    isNew: true,
                    isEdit: true,
                    children: [],
                }))
            }
        },
        {
            label: "新建文件",
            click() {
                data.isFolder && (data.isExpand = true)
                data.children?.push(convert({
                    key: v4(),
                    title: "",
                    isNew: true,
                    isEdit: true,
                }))
            }
        },
        {
            label: "新建",
            submenu: [
                {
                    label: "markdown",
                },
                {
                    label: "代码片段",
                },
            ]
        },
        {
            label: "删除",
            click() {
                handleDelete()
            }
        },
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}
// TODO 处理移动文件或文件夹回调， 处理节点在某个节点上方，内部，下方
const dropFn = (status: ENiuTreeStatus, data: INiuTreeData<any>, targetData: INiuTreeData<any>): Promise<boolean> => {
    console.log(status);
    return new Promise((resolve) => {
        isLoading.value = true
        setTimeout(() => {
            isLoading.value = false
            resolve(true)
        }, 2000);
    })
}
function handleDelete() {
    if (!focusKey.value) return
    const data = findByKey(focusKey.value, list.value)
    if (data) {
        isLoading.value = true
        setTimeout(() => {
            isLoading.value = false
            data.isDel = true
            removeByKey(data.key, list.value)
        }, 2000);
    }
}
/**
 * 处理重命名回调
 */
function handleRename(data: INiuTreeData, done: (status?: boolean) => void) {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        done(false)
    }, 2000);
}
/**
 * 处理创建回调
 */
function handleCreateOne(key: INiuTreeKey, done: (status: boolean) => void) {
    isFocus.value = true
    activeKeys.value = [key]
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        done(true)
    }, 2000);
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
