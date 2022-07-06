<template>
    <!-- 去除拼写检查 -->
    <div ref="editorEl" spellcheck="false"></div>
</template>
<script lang="ts" setup>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const props = defineProps<{
    modelValue: string
}>()
const emits = defineEmits<{
    (ev: "update:modelValue", text?: string): void
}>()
const editorEl = ref()
let instance: Editor | null = null
onMounted(() => {
    instance = new Editor({
        el: editorEl.value,
        initialEditType: "wysiwyg",
        initialValue: props.modelValue,
        previewStyle: 'tab',
        height: '100%',
        placeholder: "输入点什么",
        language: "zh-hans",
        hooks: { // 钩子函数
            addImageBlobHook: (fileOrBlob, callback) => {
                console.log(fileOrBlob);
                callback("", 'T_T，出错了');
                // this.uploadImgApi(fileOrBlob).then(path => {
                //     callback(path, 'T_T，出错了');
                // });
            },
        }
    });
    // watch(()=>props.modelValue, ()=>{
    //     instance?.setMarkdown(props.modelValue)
    // })
    instance.on("keyup", (e, b) => {
        emits("update:modelValue", instance?.getMarkdown())
    })
})
onBeforeUnmount(() => {
    if (instance) {
        instance.off("keyup")
        instance.destroy()
    }
})

</script>

<style lang="less" scoped>
</style>
