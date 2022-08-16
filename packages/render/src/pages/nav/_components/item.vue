<template>
    <div
        class="node"
        :title="data.title"
        :onContextmenu="(e: Event) => emits('contextmenu', e)"
        @dblclick.stop="onExpand(data)"
        @dragover.prevent="onDragover"
        @dragleave.prevent="onDragleave"
        @drop.prevent="onDrop"
    >
        <div
            class="node__text"
            :class="[
                activeKeys.includes(data.key) ? 'active' : '',
                isFocus ? 'focus' : '',
                // isInCild ? 'inchild' : '',
                focusKey === data.key ? 'focus-file' : '',
            ]"
            :style="{
                paddingLeft: deep * 10 + 'px',
                backgroundColor: isDragging ? '#fcd34d': ''
            }"
        >
            <div class="node__text__text">
                <div
                    class="h-1/1 mx-5px flex items-center"
                    style="width: 15px; height: 15px"
                    @click.stop="onExpand(data)"
                    @dblclick.stop
                >
                    <svg-icon
                        v-if="data.isFolder && !data.isExpand"
                        name="code-folder"
                        style="width: 100%; height: 100%"
                    ></svg-icon>
                    <svg-icon
                        v-if="data.isFolder && data.isExpand"
                        name="code-folder-open"
                        style="width: 100%; height: 100%"
                    ></svg-icon>
                    <svg-icon
                        v-if="data.isFile"
                        name="code-file"
                        style="width: 100%; height: 100%"
                    ></svg-icon>
                </div>
                <div v-if="!data.isEdit" :onClick="(e: any) => emits('click', e)" class="node__text__title">
                    {{ data.title }}
                </div>
                <form action="#" v-if="data.isEdit" class="flex-1 w-0" @submit="onSubmit($event, data)">
                    <input
                        id="value"
                        @click.passive.stop
                        @contextmenu.prevent.stop
                        v-focus="data"
                        @blur="onSubmit($event, data)"
                        :value="data.title"
                    />
                </form>
                <div class="ml-5px text-size-12px text-gray-400">{{data.children?.length?data.children?.length:''}}</div>
                <svg-icon
                    v-if="openKey === data.key"
                    name="code-active"
                    class="ml-5px"
                    style="width: 8px; height: 8px"
                ></svg-icon>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.node {
    position: relative;

    .node__text {
        font-size: 12px;
        cursor: pointer;
        line-height: 25px;
        .node__text__text {
            padding: 0 10px 0 0;
            display: flex;
            align-items: center;
        }

        &.focus-file {
            position: relative;

            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 1px solid #6db6ff;
                pointer-events: none;
            }
        }

        &.active {
            background-color: #e4e6f1;
            color: #333;

            &.focus {
                color: #333;
                background-color: #aad5ff;
            }
        }

        &.inchild {
            color: #333;
            background-color: #e4e6f1;

            &.focus {
                color: #333;
                background-color: #aad5ff86;
            }
        }

        form {
            flex: 1;
            width: 0;
            height: 100%;

            input {
                height: 100%;
                padding: 0;
                width: 100%;
                color: #333;
                border-radius: 5px;
                outline: 0;
                border: 1px solid #32aff8b2;
            }
        }

        .node__text__title {
            height: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            width: 0;
            display: flex;
            align-items: center;
        }
    }
}
</style>
<script lang="ts">
export default defineComponent({
    inheritAttrs: false,
})
</script>
<script lang="ts" setup>
// import { judgeFile } from '@common/util/file'
import { Ref } from "vue"
import { findByKeyParent, isChildOf, removeByKey } from "princess-ui"
import type { INiuTreeKey, INiuTreeData, ENiuTreeStatus } from "princess-ui"
import { trim } from "lodash"
import { emit } from "process";

const emits = defineEmits<{
    (e: "update:focus-key", focusKey?: INiuTreeKey): void
    (e: "change"): void
    (e: "rename", date: INiuTreeData, done: (status?: boolean) => void): void
    (e: "click", ev: any): void
    (e: "contextmenu", ev: any): void
    (e: "createOne", data: INiuTreeData, parent: INiuTreeData | undefined, done: (status?: boolean) => void): void
    (e: "itemDragover", ev: DragEvent, active: (status: boolean) => void, data: INiuTreeData): void
    (e: "itemDragleave", ev: DragEvent, active: (status: boolean) => void, data: INiuTreeData): void
    (e: "itemDrop", ev: DragEvent, active: (status: boolean) => void, data: INiuTreeData): void
}>()

const isDragging = ref(false)
function onDragover(ev: DragEvent) {
    if(props.dataSourceKey) return
    emits("itemDragover", ev, (status: boolean) => {
        isDragging.value = status
    }, props.data)
}
function onDragleave(ev: DragEvent) {
    if(props.dataSourceKey) return
    emits("itemDragleave", ev, (status: boolean) => {
        isDragging.value = status
    }, props.data)
}
function onDrop(ev: DragEvent) {
    if(props.dataSourceKey) return
    emits("itemDrop", ev, (status: boolean) => {
        isDragging.value = status
    }, props.data)
}

function onExpand(data: INiuTreeData) {
    data.isExpand = !data.isExpand
    emits("change")
}

const props = withDefaults(
    defineProps<{
        data: INiuTreeData
        list: INiuTreeData[]
        activeKeys?: INiuTreeKey[]
        openKey?: INiuTreeKey
        focusKey?: INiuTreeKey
        deep: number
        dataSourceKey: INiuTreeKey
        status: ENiuTreeStatus
        isFocus?: boolean
    }>(),
    {
        activeKeys: () => [],
    },
)
function judgeFile(filename: string) {
    if (!filename) return
    let ext = [
        { language: "vue", ext: ".vue", index: -1 },
        { language: "javascript", ext: ".js", index: -1 },
        { language: "css", ext: ".css", index: -1 },
        { language: "scss", ext: ".scss", index: -1 },
        { language: "html", ext: ".html", index: -1 },
        { language: "tsx", ext: ".tsx", index: -1 },
        { language: "typescript", ext: ".ts", index: -1 },
        { language: "markdown", ext: ".md", index: -1 },
        { language: "dot", pre: ".", index: -1 },
    ]
    let cur
    for (let i = 0; i < ext.length; i++) {
        const e = ext[i]
        if (e.ext && filename.endsWith(e.ext)) {
            let index = filename.lastIndexOf(e.ext)
            e.index = index
            cur = e
            break
        }
        if (e.pre && filename.startsWith(e.pre)) {
            let index = filename.indexOf(e.pre)
            e.index = index
            cur = e
            break
        }
    }
    return cur
}

const draggable = inject<Ref<boolean>>("draggable")
const vFocus = {
    mounted(el: HTMLInputElement, binding: any) {
        if (draggable) {
            draggable.value = false
        }
        emits("update:focus-key", undefined)
        let data = binding.value
        let curFile = judgeFile(data.title)
        if (data.isFile && curFile) {
            let index = curFile.index
            if (curFile.ext) {
                el.setSelectionRange(0, index)
            }
            if (curFile.pre) {
                el.setSelectionRange(index + 1, data.title.length)
            }
        } else {
            el.select()
        }
        el.focus()
    },
}
function onSubmit(e: Event, data: INiuTreeData) {
    e.preventDefault()
    if (draggable) {
        draggable.value = true
    }
    const el = e.target as HTMLInputElement
    let value = ""
    if (el.tagName.toLowerCase() === "form") {
        // @ts-ignore
        let inputEl = el.value as HTMLInputElement
        value = inputEl.value
    }
    if (el.tagName.toLowerCase() === "input") {
        value = el.value
    }
    if (!value && data.isNew) {
        data.isDel = true
        removeByKey(data.key, props.list)
    } else if (value != data.title) {
        if (data.isNew) {
            data.title = trim(value)
            data.isNew = false
            data.isEdit = false
            const parent = findByKeyParent(data.key, props.list)
            emits("createOne", data, parent, (status: boolean = true)=>{
                if(status){
                    emits("change")
                }else{
                    data.isDel = true
                    removeByKey(data.key, props.list)
                }
            })
        }else{
            if(value && data.isFolder){
                const oldTitle = data.title
                data.title = trim(value)
                data.isEdit = false
                emits("rename", data, (status: boolean = true)=>{
                    if(status){
                        emits("change")
                    }else{
                        data.title = oldTitle
                    }
                })
            }else if(value && data.isFile){
                let curFile = judgeFile(value)
                if (data.isFile && curFile) {
                    let index = curFile.index
                    let t = ""
                    if (curFile.ext) {
                        let t = value.slice(0, index)
                        if(t){
                            const oldTitle = data.title
                            t && (data.title = trim(t)+curFile.ext)
                            emits("rename", data, (status: boolean = true)=>{
                                if(status){
                                    emits("change")
                                }else{
                                    data.title = oldTitle
                                }
                            })
                        }
                    }
                    if (curFile.pre) {
                        let t = value.slice(index + 1, value.length)
                        if(t){
                            const oldTitle = data.title
                            t && (data.title = curFile.pre + trim(t))
                            emits("rename", data, (status: boolean = true)=>{
                                if(status){
                                    emits("change")
                                }else{
                                    data.title = oldTitle
                                }
                            })
                        }
                    }
                    data.isEdit = false
                } else {
                    const oldTitle = data.title
                    data.title = trim(value)
                    data.isEdit = false
                    emits("rename", data, (status: boolean = true)=>{
                        if(status){
                            emits("change")
                        }else{
                            data.title = oldTitle
                        }
                    })
                }
            }else{
                data.isEdit = false
            }
        }

    } else {
        data.isEdit = false
    }
}
</script>
