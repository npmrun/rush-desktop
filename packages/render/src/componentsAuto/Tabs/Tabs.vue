<template>
    <div class="border-b relative" style="background-color: #f3f3f3;">
        <niu-scrollbar>
            <div class="tabs inline-flex mt-4px overflow-hidden px-4px">
                <div class="tab" v-for="(tab, index) in tabs" @click="emit('update:modelValue', tab.key)"
                    :class="[modelValue == tab.key ? 'active' : '']" :style="{
                        backgroundColor: tab.bg,
                        color: tab.color
                    }">
                    <div class="flex-1 w-0">
                        <span>{{ tab.label }}</span>
                    </div>
                </div>
            </div>
        </niu-scrollbar>
    </div>

</template>
<script lang="ts" setup>
const props = defineProps<{
    tabs: {
        key: string | number
        bg?: string
        color?: string
        label: string
    }[],
    modelValue: string | number
}>()

const emit = defineEmits<{
    (event: "update:modelValue", key: string | number): void
}>()

</script>

<style lang="less" scoped>
.tabs {
    height: 34px;
    line-height: 34px;

}

.tab {
    transform: translateY(8px);
    background-color: white;
    transition: transform .1s linear, opacity .1s linear;
    // border: 1px solid #cfcfcf;
    border-bottom: 0;
    opacity: .4;
    display: inline-flex;
    flex: 1;
    width: 0;

    &.active {
        opacity: 1;
        transform: translateY(0);
    }

    @apply mr-4px pl-8px cursor-pointer inline-flex max-w-200px min-w-180px w-180px rounded-tl-xl rounded-tr-xl;
}
</style>
