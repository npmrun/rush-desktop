<template>
    <div>
        <filetree :list="list" @clickNode="handleClickNode" v-model:activeKeys="activeKeys" v-model:openKey="openKey"></filetree>
        {{activeKeys}}
    </div>
</template>
<script lang="ts" setup>
import { convertTreeData, INiuTreeData, INiuTreeKey } from 'princess-ui';
import filetree from './_ui/filetree.vue';

const openKey = ref<INiuTreeKey>()
const activeKeys = ref<INiuTreeKey[]>([])

function handleClickNode(data: INiuTreeData) {
    console.log(12);
    
    openKey.value = data.key
    activeKeys.value = [data.key]
}

const list = ref(convertTreeData([
    {
        key: 1,
        title: "1",
        children: []
    },
    {
        key: 2,
        title: "2",
        children: []
    },
    {
        key: 3,
        title: "3",
        children: []
    },
]))
</script>
<style lang="less" scoped>
</style>
