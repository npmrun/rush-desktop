<template>
    <div
        class="relative w-1/1 h-250px bg-light-700 flex cursor-pointer"
        @drop="onDrop"
        @dragenter="onDragenter"
        @dragleave="onDragleave"
    >
        <input @change="chooseFile" multiple class="absolute top-0 left-0 right-0 bottom-0 opacity-0" type="file" />
        <div class="m-auto">
            <div
                class="text-center text-size-16px font-light border border-dotted border-dark-50 p-35px"
                :class="{ 'border-red-300': isDragging, 'text-red-400': isDragging }"
            >
                <span>拖拽或点击选择文件</span>
            </div>
            <div class="">sada</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { file2Base64 } from "@/utils/file"

interface IFile {
    name: string
    percent: number
    status: "error" | "success" | "done" | "uploading" | "removed"
    thumbUrl: string
    uid: string
    url: string
}

const isDragging = ref(false)
const filelist = ref<File[]>([])

const emit = defineEmits<{
    (ev: "change", filelist: File[]): void
}>()

function readFiles(files: FileList) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i]
        filelist.value.push(file)
    }
    if (files.length) {
        emit("change", filelist.value)
    }
}

function chooseFile(event: any) {
    if (event.target && event.target.files) {
        readFiles(event.target.files)
    }
}
async function onDrop(event: DragEvent) {
    event.preventDefault()
    isDragging.value = false
    if (event.dataTransfer) {
        readFiles(event.dataTransfer.files)
    }
}
function onDragenter() {
    isDragging.value = true
}
function onDragleave() {
    isDragging.value = false
}
</script>
