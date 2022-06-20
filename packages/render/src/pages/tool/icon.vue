<template>
    <div>
        <file-upload @change="changeFile"></file-upload>
        <img :src="src" />
    </div>
</template>
<script lang="ts" setup>
import FileUpload from "./_ui/fileupload.vue"

function changeFile(files: File[]) {
    console.log(files)
}

const src = ref("")
function reader(f: Blob) {
    var reader = new FileReader()
    reader.readAsDataURL(f)

    reader.onload = function () {
        src.value = reader.result as string
    }
}

function onDrop(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
        let files = event.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            reader(file)
        }
    }
}

function chooseFile(event: any) {
    if (event.target && event.target.files) {
        console.log(event.target.files)
        reader(event.target.files[0])
    }
}

function onDragover(ev: DragEvent) {
    console.log(ev)
}
</script>

<style lang="less" scoped></style>
