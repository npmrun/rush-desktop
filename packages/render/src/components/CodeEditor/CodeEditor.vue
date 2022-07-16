<template>
    <div class="h-1/1 relative">
        <div class="h-1/1" ref="editorRef"></div>
        <div class="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-20" :style="logo ? {
            backgroundImage: `url(${logo})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
        } : {}">
            <!-- <img class="absolute top-1/2 left-1/2 transform  -translate-x-1/2 -translate-y-1/2 h-1/1" v-if="logo"
                :src="logo" alt=""> -->
            <img v-if="!logo" class="absolute top-1/2 left-1/2 transform  -translate-x-1/2 -translate-y-1/2"
                src="./120x120.png" alt="">
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
        logo?: string
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
    if (editorRef.value && !editor) {
        editor = monaco.editor.create(editorRef.value, {
            theme: "vs-light",
            fontFamily: 'Cascadia Mono, Consolas, "Courier New", monospace',
        }) as monaco.editor.IStandaloneCodeEditor
        editor.onDidChangeModelContent(e => {
            if (editor) {
                let code = editor.getValue()
                emit("update:modelValue", code)
            }
        })
    }
    function updateModel(name: string, content: string) {
        if (editor) {
            var oldModel = editor.getModel() //获取旧模型
            let file = judgeFile(name)
            let model: monaco.editor.ITextModel = monaco.editor.createModel(content ?? "", file?.language ?? "txt")
            if (oldModel) {
                oldModel.dispose()
            }
            editor.setModel(model)
        }
    }
    // 文件内容改变，更新需要语言
    // watch(
    //     () => props.modelValue,
    //     async (modelValue) => {
    //         if (editor && props.modelValue !== editor.getValue()) {
    //             updateModel(props.name, modelValue)
    //         }
    //     },
    //     { immediate: true },
    // )
    // 文件名改变，需要更新语言
    watch(
        () => props.name,
        async (name) => {
            if (editor) {
                updateModel(name, props.modelValue)
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
