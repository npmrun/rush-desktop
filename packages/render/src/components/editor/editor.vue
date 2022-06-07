<template>
    <div class="h-1/1 flex flex-col relative">
        <div class="flex-1" ref="editorRef"></div>
        <div
            class="absolute top-1/2 left-1/2 transform  -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
            <img src="./120x120.png" alt="">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { judgeFile } from "./util"
import { monaco } from "./monaco"

const editorRef = ref<HTMLDivElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const props = withDefaults(
    defineProps<{
        modelValue?: string
        name?: string
    }>(),
    {
        modelValue: "",
        name: "",
    },
)
const emit = defineEmits<{
    (e: "update:modelValue", code: string): void
}>()

onMounted(() => {
    watch(
        () => props.name,
        async name => {
            if (editorRef.value && !editor) {
                editor = monaco.editor.create(editorRef.value, {
                    theme: "vs-light",
                    fontFamily: 'Cascadia Mono, Consolas, "Courier New", monospace',
                })
                editor.onDidChangeModelContent(e => {
                    if (editor) {
                        let code = editor.getValue()
                        emit("update:modelValue", code)
                    }
                })
            }
            if (editor) {
                var oldModel = editor.getModel() //获取旧模型
                let file = judgeFile(name)
                let model: monaco.editor.ITextModel = monaco.editor.createModel(props.modelValue ?? "", file?.language ?? "txt")
                if (oldModel) {
                    oldModel.dispose()
                }
                editor.setModel(model)
            }
        },
        { immediate: true },
    )
})

onBeforeUnmount(() => {
    if (editor) {
        var oldModel = editor.getModel()
        if (oldModel) {
            oldModel.dispose()
        }
        editor?.dispose()
        editor = null
    }
})
useResizeObserver(editorRef, () => {
    if (editor) {
        editor.layout()
    }
})
</script>
