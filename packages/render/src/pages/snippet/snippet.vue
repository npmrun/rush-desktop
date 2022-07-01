<template>
    <div class="h-1/1">
        <div class="w-250px h-1/1 flex flex-col relative bg-light-600" v-loading="_isLoading == 2">
            <div v-if="_isLoading == 1" class="absolute left-0 right-0 top-0 bottom-0 opacity-0 z-999"></div>
            <div class="border-b px-8px py-5px">
                <span>笔记本</span>
            </div>
            <div class="flex-1 pb-8px overflow-auto scrollbar" @contextmenu="onGlobalContextmenu">
                <filetree @expand="onExpand" :dropFn="dropFn" :list="list" @clickNode="handleClickNode"
                    v-model:activeKeys="activeKeys" v-model:openKey="openKey" v-model:focusKey="focusKey"
                    v-model:isFocus="isFocus" @contextmenu="onContextmenu" @itemDragover="onDragover"
                    @rename="handleRename" @itemDragleave="onDragleave" @itemDrop="onDrop"
                    @create-one="handleCreateOne"></filetree>
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
const _isLoading = ref(0)
let timer: NodeJS.Timeout | null = null
// 1000ms内没有执行成功则出现加载框
watch(() => isLoading.value, (value, oldValue) => {
    if (isLoading.value) {
        timer && clearTimeout(timer)
        timer = null
        _isLoading.value = 1
        timer = setTimeout(() => {
            _isLoading.value = 2
        }, 1000);
    } else {
        timer && clearTimeout(timer)
        timer = null
        _isLoading.value = 0
    }
}, { immediate: true })
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
                    click(){
                        console.log(activeKeys);
                        if(activeKeys.value.includes(data.key)){
                            console.log("哈哈")
                        }
                    }
                },
                {
                    label: "代码片段",
                },
            ]
        },
        {
            label: "删除",
            click() {
                if(activeKeys.value.includes(data.key)){
                    console.log("哈哈")
                }else{
                    handleDelete(data)
                }
            }
        },
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}

const dropFn = (status: ENiuTreeStatus, data: INiuTreeData<any>, targetData: INiuTreeData<any>): Promise<boolean> => {
    return new Promise(async (resolve) => {
        try {
            isLoading.value = true
            await _agent.call("api.snippet.move", status, data.key, targetData.key)
            isLoading.value = false
            resolve(true)
        } catch (error) {
            console.error(error);
            isLoading.value = false
            resolve(false)
        }
    })
}

async function handleDelete(data: INiuTreeData) {
    try {
        isLoading.value = true
        await _agent.call("api.snippet.del", data.key)
        isLoading.value = false
        data.isDel = true
        removeByKey(data.key, list.value)
    } catch (error) {
        console.error(error);
        isLoading.value = false
    }
}
/**
 * 处理重命名回调
 */
async function handleRename(data: INiuTreeData, done: (status?: boolean) => void) {
    try {
        isLoading.value = true
        await _agent.call("api.snippet.rename", data.key, data.title)
        isLoading.value = false
        done(true)
    } catch (error) {
        console.error(error);
        isLoading.value = false
        done(false)
    }
}
function onExpand(node: INiuTreeData) {
    _agent.call("api.snippet.expand", node.key, node.isExpand)
}
/**
 * 处理创建回调
 */
async function handleCreateOne(data: INiuTreeData, parent: INiuTreeData | undefined, done: (status: boolean) => void) {
    try {
        isLoading.value = true
        await _agent.call("api.snippet.add", toRaw(data), parent?.key)
        isFocus.value = true
        activeKeys.value = [data.key]
        isLoading.value = false
        done(true)
    } catch (error) {
        console.error(error);
        isLoading.value = false
        done(false)
    }
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

const list = ref<INiuTreeData[]>([])
onBeforeMount(() => {
    (async () => {
        let _list = await _agent.call("api.snippet.readData")
        console.log(_list);
        if (Array.isArray(_list)) {
            list.value = convertTreeData(_list)
        }
    })()
})
</script>
<style lang="less" scoped>
</style>
