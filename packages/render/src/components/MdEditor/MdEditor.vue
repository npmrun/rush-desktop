<template>
    <!-- 去除拼写检查 -->
    <div ref="editorEl" spellcheck="false"></div>
</template>
<script lang="ts" setup>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { MD5 } from 'crypto-js';
import { uniqueId, trim } from 'lodash';

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
        initialEditType: "markdown",
        initialValue: props.modelValue,
        previewStyle: 'tab',
        height: '100%',
        placeholder: "输入点什么",
        language: "zh-hans",
        hooks: { // 钩子函数
            addImageBlobHook: (fileOrBlob, callback) => {
                //  1. 从本地赋值到剪切板的
                //  2. 拖拽过来的
                //  3. 网址
                // File-->ArrayBuffer-->Uint8Array
                console.log(fileOrBlob);

                var reader = new FileReader();
                reader.readAsArrayBuffer(fileOrBlob)
                reader.onload = async function (e) {
                    var buf = new Uint8Array(reader.result as ArrayBuffer);

                    const path = await _agent.call("api.config.keys", "storagePath")
                    const t = new Date().getTime() as unknown as string
                    // @ts-ignore
                    const file = fileOrBlob.name as string
                    let ext = file.split(".")[file.split(".").length - 1]
                    const name = uniqueId() + "_T_" + MD5(t) + "." + ext
                    await _agent.file.savaFileByData(path + `/file/asset/image/${name}`, buf)
                    callback(`rush-file://asset/image/${name}`, 'T_T，出错了');
                }
            },
        },
        customHTMLRenderer: {

            image(node, context, convertors) {
                // @ts-ignore
                const { destination } = node;
                const { getChildrenText, skipChildren } = context;
                
                skipChildren();
                return {
                        type: 'openTag',
                        tagName: 'img',
                        attributes: {
                            style: "max-width: 70%;display: inline-block;", 
                            src: decodeURIComponent(destination) + `?time=${new Date().getTime()}`,
                            alt: getChildrenText(node)
                        },
                    }
            }
        }
    });
    // watch(()=>props.modelValue, ()=>{
    //     if(props.modelValue !== instance?.getMarkdown()){
    //         instance?.setMarkdown(props.modelValue)
    //     }
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
