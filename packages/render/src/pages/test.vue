<template>
    <div>
        <div id="editor"></div>
    </div>
</template>

<script lang="ts" setup>
import { MD5 } from 'crypto-js';
import { uniqueId } from 'lodash-es';
import Vditor from 'vditor'
import "vditor/dist/index.css"

console.log(Vditor);
const editor = ref()
onMounted(() => {
    console.log(editor.value);
    const contentEditor = new Vditor("editor", {
        height: 360,
        toolbarConfig: {
            pin: true,
        },
        cache: {
            enable: false,
        },
        after: () => {
            contentEditor.setValue('hello, Vditor + Vue!')
        },
        upload: {
            success(a,b ){
                console.log(a, b);
            },
            error(a){
                console.log(a);
            },
            handler(files) {
                return new Promise<null>((resolve, reject) => {
                    const fileOrBlob = files[0]
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
                        contentEditor.insertValue(`![](rush-file://asset/image/${name})`)
                        resolve(null);
                    }
                })
            }
        }
    })
    contentEditor
})
</script>
