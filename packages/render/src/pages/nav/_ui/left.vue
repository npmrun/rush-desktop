<template>
    <div class="h-1/1 overflow-hidden flex flex-col relative bg-light-600">
        <div class="flex-1 pb-8px overflow-auto scrollbar" @contextmenu="onGlobalContextmenu">
            <filetree @clickNode="handleClickNode" :list="state.list" @contextmenu="onContextmenu"
                v-model:activeKeys="state.activeKeys" v-model:openKey="state.openKey" v-model:focusKey="state.focusKey"
                v-model:isFocus="state.isFocus" @rename="handleRename" @create-one="handleCreateOne">
            </filetree>
        </div>
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { PopupMenu } from "@/bridge/PopupMenu"
import { convert, INiuTreeData } from "princess-ui";
import { v4 } from "uuid";
import { IState } from "../nav.vue";
import filetree from "../_components/filetree.vue"

function onGlobalContextmenu(e: MouseEvent) {
    e.stopPropagation()
    const menuList: IMenuItemOption[] = [
        {
            label: "新建文件夹",
            click() {
                state.list?.push(
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
            label: "新建文件",
            click() {
                state.list?.push(
                    convert({
                        key: v4(),
                        title: "",
                        isNew: true,
                        isEdit: true,
                    }),
                )
            },
        }
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}
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
            label: "新建文件",
            click() {
                data.isFolder && (data.isExpand = true)
                data.children?.push(
                    convert({
                        key: v4(),
                        title: "",
                        isNew: true,
                        isEdit: true,
                    }),
                )
            },
        },
    ]
    const menu = new PopupMenu(menuList)
    menu.show()
}

function handleClickNode(data: INiuTreeData) {
    state.openKey = data.key
    state.activeKeys = [data.key]
}
async function handleRename(data: INiuTreeData, done: (status?: boolean) => void) {
    done(true)
}
async function handleCreateOne(data: INiuTreeData, parent: INiuTreeData | undefined, done: (status: boolean) => void) {
    state.isFocus = true
    state.activeKeys = [data.key]
    done(true)
}

const state = inject(IState, { list: [], activeKeys: [] })

</script>

<style lang="less" scoped>
</style>
