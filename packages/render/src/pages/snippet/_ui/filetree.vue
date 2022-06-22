<template>
    <div ref="filetree">
        <ps-tree v-bind="props" @itemDragstart="onItemDragstart">
            <template #default="data">
                <item
                    @click.stop="clickNode($event, data.data)"
                    @change="() => emit('change')"
                    @contextmenu.stop="onContextMenu($event, data.data)"
                    :active-keys="activeKeys"
                    :open-key="openKey"
                    v-bind="{ ...data, ...$attrs }"
                    :list="list"
                    @create-one="handleCreateOne"
                    v-model:focus-key="focusKey"
                    :isFocus="isFocus"
                ></item>
            </template>
        </ps-tree>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    inheritAttrs: false,
})
</script>

<script lang="ts" setup>
import item from "./item.vue"
import { INiuTreeData, INiuTreeKey } from "princess-ui"
import { convert, removeByKey, findByKey } from "princess-ui"
import { v4 } from "uuid"
import { Ref, UnwrapRef } from "vue"

const props = withDefaults(
    defineProps<{
        list: INiuTreeData[]
        openKey?: INiuTreeKey
        activeKeys?: INiuTreeKey[]
        focusKey?: INiuTreeKey
        isFocus?: boolean
        justOpen?: boolean
        justOpenOne?: boolean
    }>(),
    {
        justOpen: false,
        isFocus: false,
        activeKeys: () => [],
        justOpenOne: false,
    },
)
const emit = defineEmits<{
    (e: "update:activeKeys", keys: INiuTreeKey[]): void
    (e: "update:focusKey", key?: INiuTreeKey): void
    (e: "update:isFocus", bol: boolean): void
    (e: "update:openKey", key?: INiuTreeKey): void
    (e: "contextmenu", data: INiuTreeData): void
    (e: "clickNode", data: INiuTreeData): void
    (e: "change"): void
    (e: "delOne", node: INiuTreeData, ev: (canDel: boolean) => void): void
}>()

const keys = useMagicKeys()
const Ctrl = keys["Ctrl"]
const isPressCtrl = ref(false)

function usePropsUpdate<T extends any>(propsValue: keyof typeof props, initValue: T) {
    const refValue = ref<T>(initValue)
    watch(
        () => props[propsValue],
        () => {
            refValue.value = props[propsValue] as UnwrapRef<T>
        },
        {
            immediate: true,
            deep: true,
        },
    )
    watch(
        () => refValue.value,
        () => {
            emit(("update:" + propsValue) as any, refValue.value as any)
        },
        {
            immediate: true,
            deep: true,
        },
    )
    return refValue
}

const activeKeys = usePropsUpdate<INiuTreeKey[]>("activeKeys", [])
const focusKey = usePropsUpdate<INiuTreeKey | undefined>("focusKey", undefined)
const isFocus = usePropsUpdate<boolean>("isFocus", false)

function onItemDragstart() {
    isFocus.value = false
}

watch(
    () => props.openKey,
    key => {
        if (key && !activeKeys.value.includes(key) && findByKey(key, props.list)) {
            isFocus.value = true
            activeKeys.value.push(key)
        }
    },
    {
        immediate: true,
    },
)

watch(
    Ctrl,
    v => {
        isPressCtrl.value = v
    },
    {
        immediate: true,
    },
)
const filetree = ref()
onClickOutside(filetree, () => {
    isFocus.value = false
    focusKey.value = undefined
})

function handleCreateOne(key: INiuTreeKey) {
    emit("update:openKey", key)
    isFocus.value = true
    activeKeys.value = [key]
}

function delArray(array: INiuTreeKey[]) {
    for (let i = array.length - 1; i >= 0; i--) {
        const key = array[i]
        delOne(key)
    }
}
function delOne(key: INiuTreeKey) {
    let index = activeKeys.value.indexOf(key)
    if (index != -1) {
        activeKeys.value.splice(index, 1)
    }
    if (focusKey.value === key) {
        focusKey.value = undefined
    }
    if (props.openKey === key) {
        emit("update:openKey", undefined)
    }
    removeByKey(key, props.list, (node: any) => {
        node.isDel = true
    })
    emit("change")
}

defineExpose({
    delArray,
    delOne,
})

function onContextMenu(e: Event, data: INiuTreeData) {
    isFocus.value = true
    focusKey.value = data.key
    emit("contextmenu", data)
}
function clickNode(e: Event, data: INiuTreeData) {
    e.stopPropagation()
    isFocus.value = true
    focusKey.value = undefined
    if (isPressCtrl.value) {
        let index = activeKeys.value.indexOf(data.key)
        if (index != -1) {
            activeKeys.value.splice(index, 1)
        } else {
            activeKeys.value.push(data.key)
        }
        e.stopPropagation()
        return
    }
    emit("clickNode", data)
}
</script>
