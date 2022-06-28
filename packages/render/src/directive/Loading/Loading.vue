<template>
    <div class="loading">
        <div class="loading__mask"></div>
        <div class="loading__wrapper">
            <div class="loading__text">{{ text }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const porps = withDefaults(
    defineProps<{
        text?: string
    }>(),
    {
        text: "loading",
    },
)
console.log(porps.text)
</script>

<style lang="less" scoped>
.loading {
    .loading__mask {
        background-color: rgba(255, 255, 255, 0.699);
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }
    .loading__wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        text-align: center;
        .loading__text {
            color: #333;
        }
    }
}
</style>
