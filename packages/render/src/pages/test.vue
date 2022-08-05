<template>
    <div class="h-1/1 flex flex-col">
        <div class="flex-1 h-0"><MdEditor v-model="text"></MdEditor></div>
        <div>{{text}}</div>
    </div>
</template>

<script lang="ts" setup>
import MdEditor from "./MdEditor.vue";

const text = ref('hello, Vditor + Vue!')
</script>
