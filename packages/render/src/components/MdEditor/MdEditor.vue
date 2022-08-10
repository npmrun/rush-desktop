<template>
    <div id="editor"></div>
</template>

<script lang="ts" setup>
import MD5 from 'md5';
import { uniqueId } from 'lodash-es';
import Vditor from 'vditor'
import "vditor/dist/index.css"

const props = defineProps<{
    modelValue: string,
}>()

const emits = defineEmits<{
    (ev: "update:modelValue", value: string): void
}>()

let contextEditor: Vditor | null = null
onMounted(() => {
    contextEditor = new Vditor("editor", {
        height: '100%',
        mode: "wysiwyg",
        toolbarConfig: {
            pin: true,
        },
        input(value) {
            emits("update:modelValue", value)
        },
        cache: {
            enable: false,
        },
        after: () => {
            contextEditor?.setValue(props.modelValue)
        },
        upload: {
            handler(files) {
                const uploadPromise = []
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    uploadPromise.push(new Promise((resolve) => {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(file)
                        reader.onload = async function (e) {
                            var buf = new Uint8Array(reader.result as ArrayBuffer);
                            const path = await _agent.call("api.config.keys", "storagePath")
                            const t = new Date().getTime() as unknown as string
                            // @ts-ignore
                            const fileName = file.name as string
                            let ext = fileName.split(".")[fileName.split(".").length - 1]
                            const name = uniqueId() + "_T_" + MD5(t).toString().toUpperCase() + "." + ext
                            if(ext.toLowerCase() === "jpg" || ext.toLowerCase() === "png" || ext.toLowerCase() === "jpeg"){
                                await _agent.file.savaFileByData(path + `/file/asset/image/${name}`, buf)
                                contextEditor?.insertValue(`![](rush-file://asset/image/${name})`)
                            }else{
                                await _agent.file.savaFileByData(path + `/file/asset/file/${name}`, buf)
                                contextEditor?.insertValue(`[${fileName}](rush-file://asset/file/${name})`)
                            }
                            resolve(null);
                        }
                    }))
                }
                Promise.allSettled(uploadPromise)
                return null
            }
        }
    })
})
onBeforeUnmount(() => {
    contextEditor?.destroy()
})
</script>
