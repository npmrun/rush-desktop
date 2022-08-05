<template>
    <div class="w-250px min-w-250px h-1/1 flex flex-col relative bg-light-600" v-loading="_isLoading == 2">
        <div v-if="_isLoading == 1" class="absolute left-0 right-0 top-0 bottom-0 opacity-0 z-999"></div>
        <div class="border-b px-8px py-5px">
            <span>笔记本</span>
            <span class="ml-10px cursor-pointer text-gray-400" @click="emits('all', state)">全部</span>
        </div>
        <div class="flex-1 pb-8px overflow-auto scrollbar" @contextmenu="onGlobalContextmenu">
            <filetree
                @expand="onExpand"
                :dropFn="dropFn"
                :list="list"
                @clickNode="handleClickNode"
                v-model:activeKeys="state.activeKeys"
                v-model:openKey="state.openKey"
                v-model:focusKey="state.focusKey"
                v-model:isFocus="state.isFocus"
                @contextmenu="onContextmenu"
                @itemDragover="onDragover"
                @rename="handleRename"
                @itemDragleave="onDragleave"
                @itemDrop="onDrop"
                @create-one="handleCreateOne"
            ></filetree>
        </div>
        <slot></slot>
    </div>
</template>
<script lang="ts">
export default defineComponent({
    name: "snippet",
})
</script>
<script lang="ts" setup>
import { PopupMenu } from "@/bridge/PopupMenu"
import {
    convert,
    convertTreeData,
    ENiuTreeStatus,
    findByKey,
    INiuTreeData,
    INiuTreeKey,
    removeByKey,
} from "princess-ui"
import { v4 } from "uuid"
import filetree from "../_components/filetree.vue"

const isLoading = ref(false)
const _isLoading = ref(0)
let timer: NodeJS.Timeout | null = null
// 1000ms内没有执行成功则出现加载框
watch(
    () => isLoading.value,
    (value, oldValue) => {
        if (isLoading.value) {
            timer && clearTimeout(timer)
            timer = null
            _isLoading.value = 1
            timer = setTimeout(() => {
                _isLoading.value = 2
            }, 1000)
        } else {
            timer && clearTimeout(timer)
            timer = null
            _isLoading.value = 0
        }
    },
    { immediate: true },
)
interface IState {
    openKey: INiuTreeKey
    activeKeys: INiuTreeKey[]
    focusKey: INiuTreeKey
    isFocus: boolean
}
let state = reactive<Partial<IState>>({
    openKey: undefined,
    activeKeys: [],
    focusKey: undefined,
    isFocus: false,
})
const localData = localStorage.getItem("fuckTree")
if (localData) {
    const data = JSON.parse(localData)
    state = Object.assign(state, data)
}
const emits = defineEmits<{
    (ev: "change", key?: INiuTreeKey, data?: INiuTreeData): void
    (ev: "all", state?: Partial<IState>): void
    (ev: "dropSnip", event: DragEvent, data: INiuTreeData,state?: Partial<IState>): void
    (ev: "createSnip", key: INiuTreeKey, data: INiuTreeData, state?: Partial<IState>): void
    (ev: "clearSnip", key: INiuTreeKey, data: INiuTreeData, state?: Partial<IState>): void
    (ev: "del", keys: INiuTreeKey[], state?: Partial<IState>): void
    (ev: "rename", key: INiuTreeKey, title: string, state?: Partial<IState>): void
}>()
watch(
    () => state,
    () => {
        const data = toRaw(state)
        delete data.isFocus
        localStorage.setItem("fuckTree", JSON.stringify(data))
    },
    { immediate: true, deep: true },
)

function onGlobalContextmenu(e: MouseEvent) {
    e.stopPropagation()
    const menuList: IMenuItemOption[] = [
        {
            label: "新建文件夹",
            click() {
                list.value?.push(
                    convert({
                        key: v4(),
                        title: "",
                        isNew: true,
                        isEdit: true,
                        children: [],
                    }),
                )
            },
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
            },
        },
        {
            label: "新建文件夹",
            click() {
                data.isFolder && (data.isExpand = true)
                data.children?.push(
                    convert({
                        key: v4(),
                        title: "",
                        isNew: true,
                        isEdit: true,
                        children: [],
                    }),
                )
            },
        },
        {
            label: "新建片段",
            click() {
                emits("createSnip", data.key, data, state)
            },
        },
        {
            label: "删除",
            async click() {
                const res = await _agent.call("dialog.confrim", {title: "是否删除？", message: "将删除其所有碎片"})
                if(res==1){
                    if (state.activeKeys?.includes(data.key)) {
                        try {
                            isLoading.value = true
                            let r: INiuTreeKey[] = []
                            for (let i = 0; i < state.activeKeys.length; i++) {
                                const key = state.activeKeys[i]
                                r = r.concat(...readKeys(key))
                            }
                            await _agent.call("api.snippet.dels", r)
                            for (let i = 0; i < r.length; i++) {
                                const key = r[i]
                                const data = findByKey(key, list.value)
                                if (data) {
                                    data.isDel = true
                                    removeByKey(data.key, list.value)
                                }
                            }
                            emits("del", state.activeKeys, state)
                            isLoading.value = false
                        } catch (error) {
                            console.error(error)
                            isLoading.value = false
                        }
                    } else {
                        handleDelete(data)
                    }
                }
            },
        },
        {
            label: "清空所有片段",
            async click() {
                const res = await _agent.call("dialog.confrim", {title: "是否清空？", message: "将清空其所有碎片"})
                if(res==1){
                    emits("clearSnip", data.key, data, state)
                }
            },
        },
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}

const dropFn = (status: ENiuTreeStatus, data: INiuTreeData<any>, targetData: INiuTreeData<any>): Promise<boolean> => {
    return new Promise(async resolve => {
        try {
            isLoading.value = true
            await _agent.call("api.snippet.move", status, data.key, targetData.key)
            isLoading.value = false
            resolve(true)
        } catch (error) {
            console.error(error)
            isLoading.value = false
            resolve(false)
        }
    })
}

function readKeys(key: INiuTreeKey) {
    const result: INiuTreeKey[] = [key]
    const data = findByKey(key, list.value)
    let r = data?.children
    let index = 0
    if (r) {
        while (index<r.length) {
            const element: INiuTreeData = r[index]
            result.push(element.key)
            index++
            if(element.children && element.children.length){
                r = r?.concat(...element.children)
            }
        }
    }
    return result
}

async function handleDelete(data: INiuTreeData) {
    try {
        isLoading.value = true
        const keys = readKeys(data.key)
        await _agent.call("api.snippet.dels", keys)
        isLoading.value = false
        data.isDel = true
        removeByKey(data.key, list.value)
        emits("del", keys, state)
    } catch (error) {
        console.error(error)
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
        emits("rename", data.key, data.title, state)
        isLoading.value = false
        done(true)
    } catch (error) {
        console.error(error)
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
        state.isFocus = true
        state.activeKeys = [data.key]
        isLoading.value = false
        done(true)
    } catch (error) {
        console.error(error)
        isLoading.value = false
        done(false)
    }
}

/**
 * 当拖拽元素在该元素之上
 * @param ev 拖住事件
 * @param active 是否应用激活样式
 */
function onDragover(ev: DragEvent, active: (status: boolean) => void, data: INiuTreeData) {
    active(true)
}
/**
 * 当拖拽元素在离开该元素
 * @param ev 拖住事件
 * @param active 是否应用激活样式
 */
function onDragleave(ev: DragEvent, active: (status: boolean) => void, data: INiuTreeData) {
    active(false)
}
/**
 * 当拖拽元素释放在该元素
 * @param ev 拖住事件
 * @param active 是否应用激活样式
 */
function onDrop(ev: DragEvent, active: (status: boolean) => void, data: INiuTreeData) {
    console.log("onDrop")
    console.log(ev.dataTransfer?.getData("data"))
    emits("dropSnip", ev, data, state)
    active(false)
}
/**
 * 处理节点文本区域点击事件
 * @param data 节点数据
 */
function handleClickNode(data: INiuTreeData) {
    state.openKey = data.key
    state.activeKeys = [data.key]
}

const list = ref<INiuTreeData[]>([])
onBeforeMount(() => {
    ;(async () => {
        let _list = await _agent.call("api.snippet.readData")
        if (Array.isArray(_list)) {
            list.value = convertTreeData(_list)
        }
        watch(
            () => state.openKey,
            () => {
                if (state.openKey) {
                    const data = findByKey(state.openKey, list.value)
                    emits("change", state.openKey, data)
                } else {
                    emits("change")
                }
            },
            { immediate: true },
        )
    })()
})
</script>

<style lang="less" scoped></style>
