<template>
    <div class="actions-container">
        <div class="actions-bar top">
            <template v-for="(action, index) in topActions" :key="index">
                <router-link
                    :to="action.path"
                    custom
                    v-slot="{ href, route, navigate, isActive, isExactActive }"
                >
                    <div
                        class="action-bar__item"
                        :class="[isActive ? 'active' : '']"
                        :title="action.title"
                        @click="navigate"
                    >
                        <SvgIcon
                            style="width: 24px; height: 24px"
                            :name="action.icon"
                        ></SvgIcon>
                    </div>
                </router-link>
            </template>
        </div>
        <div class="action-bar bottom">
            <template v-for="(action, index) in bottomActions" :key="index">
                <router-link
                    :to="action.path"
                    custom
                    v-slot="{ href, route, navigate, isActive, isExactActive }"
                >
                    <div
                        class="action-bar__item"
                        :class="[isActive ? 'active' : '']"
                        :title="action.title"
                        @click="navigate"
                    >
                        <SvgIcon
                            style="width: 24px; height: 24px"
                            :name="action.icon"
                        ></SvgIcon>
                    </div>
                </router-link>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ActionStore from '@/store/module/action'

const actionStore = ActionStore()
const topActions = computed(() => actionStore.topActions)
const bottomActions = computed(() => actionStore.bottomActions)
</script>

<style lang="less" scoped>
.actions-container {
    width: 48px;
    height: 100%;
    color: var(--actionbar-text-color);
    background-color: var(--actionbar-bg-color);
    text-align: center;
    display: flex;
    flex-direction: column;
    .action-bar__item {
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        padding: 8px 0;
        position: relative;
        display: flex;
        justify-content: center;
        .action-bar__item__text {
            padding-top: 2px;
        }
        svg {
            fill: currentColor;
        }
        &:hover {
            color: var(--actionbar-text-hover-color);
        }
        &.active {
            color: var(--actionbar-text-active-color);
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 2px;
                background-color: currentColor;
            }
        }
    }
    .top {
        flex: 1;
        height: 0;
    }
}
</style>
