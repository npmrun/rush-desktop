<template>
    <div v-if="currentNote" class="h-1/1 w-1/1 flex flex-col" :key="currentNote.key">
        <div class="mt-8px mx-5px flex">
            <div class="group flex-1 w-0 border rounded-6px px-10px bg-white flex items-center">
                <input
                    v-model="currentNote.title"
                    placeholder="请输入片段标题"
                    class="w-1/1 h-30px leading-30px outline-0"
                    type="text"
                />
            </div>
            <div class="ml-8px button cursor-pointer" @click="createFile">
                <button class="h-1/1 px-15px">新增文件</button>
            </div>
        </div>
        <div class="my-8px mx-5px">
            <textarea
                class="border resize-none w-1/1 max-h-80px min-h-80px outline-0 p-6px rounded-3px"
                resize="none"
                v-model="currentNote.desc"
                placeholder="请输入描述"
                cols="30"
                rows="10"
            ></textarea>
            <!-- <n-input v-model:value="currentNote.desc"  type="textarea" placeholder="请输入描述"></n-input> -->
        </div>
        <!-- <div class="my-8px mx-5px">
            <n-dynamic-tags v-model:value="currentNote.label" />
        </div> -->
        <div class="my-8px flex border-t" :class="[currentNote.files.length?'border-b':'']">
            <div
                class="group flex-1 pl-8px py-3px border-l border-r cursor-pointer flex max-w-200px"
                v-for="(item, index) in currentNote.files"
                :key="index"
                @click="clickFile(item, index)"
                @contextmenu="contextmenuFile(item, index)"
                :style="{
                    backgroundColor: currentNote?.activeFileIndex === index ? '' : '#ebebeb87',
                }"
            >
                <div class="flex-1 w-0">
                    <div v-if="editTitleIndex !== index">{{ item.title }}</div>
                    <form action="#" class="w-1/1" @submit.prevent="editTitleIndex = -1">
                        <input
                            @click.stop
                            class="w-1/1"
                            @blur.prevent="editTitleIndex = -1"
                            v-focus="item"
                            v-if="editTitleIndex === index"
                            type="text"
                            :value="item.title"
                            :placeholder="item.title"
                        />
                    </form>
                </div>
                <div
                    v-if="editTitleIndex == -1"
                    class="ml-15px h-14px w-14px inline text-size-12px group-hover:inline hidden"
                    @click.stop="onCopy(currentNote && currentNote.files[index])"
                >
                    <svg-icon name="copy" class="h-1/1 w-1/1"></svg-icon>
                </div>
                <div class="h-1/1 w-25px px-10px">
                    <div class="hidden group-hover:block h-1/1 w-1/1" @click.stop="removeFile(item, index)">x</div>
                </div>
            </div>
        </div>
        <div class="flex-1 h-0">
            <CodeEditor
                :key="currentNote.activeFileIndex"
                v-if="
                    curLanugage != 'markdown' &&
                    currentNote &&
                    currentNote.activeFileIndex > -1 &&
                    currentNote.files[currentNote.activeFileIndex]
                "
                logo="https://w.wallhaven.cc/full/p8/wallhaven-p8gvvp.jpg"
                :name="currentNote.files[currentNote.activeFileIndex].title"
                v-model="currentNote.files[currentNote.activeFileIndex].content"
            ></CodeEditor>
            <MdEditor
                :key="currentNote.activeFileIndex"
                class="h-1/1"
                v-if="
                    currentNote &&
                    currentNote.activeFileIndex > -1 &&
                    currentNote.files[currentNote.activeFileIndex] &&
                    curLanugage == 'markdown'
                "
                v-model="currentNote.files[currentNote.activeFileIndex].content"
            />
        </div>
        <div
            class="py-5px flex text-gray-400 items-center px-10px border-l text-14px"
            :class="[curLanugage != 'markdown' ? 'border-t' : '']"
        >
            <div class="flex-1 w-0" :title="curLanugage">
                <div>{{ curLanugage }}</div>
            </div>
            <div
                v-if="currentNote && currentNote.activeFileIndex > -1 && currentNote.files[currentNote.activeFileIndex]"
            >
                words: {{ currentNote.files[currentNote.activeFileIndex].content.length }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PopupMenu } from "@/bridge/PopupMenu"
import { judgeFile } from "@/components/CodeEditor/util"
import type { ISnip, ISnipCode } from "../type"
import CodeEditor from "@/components/CodeEditor/CodeEditor.vue"
import MdEditor from "@/components/MdEditor/MdEditor.vue"
import { cloneDeep } from "lodash"
import Toastify from "toastify-js"

function toast(text: string) {
    Toastify({
        text: text,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast()
}

const props = defineProps<{
    currentNote?: ISnip
}>()
const emits = defineEmits<{
    (ev: "save", data: ISnip): void
}>()
const currentNote = ref<ISnip>()

watch(
    () => props.currentNote,
    () => {
        if (!currentNote.value) {
            currentNote.value = cloneDeep(props.currentNote)
        }
        if (currentNote.value?.key !== props.currentNote?.key) {
            currentNote.value = cloneDeep(props.currentNote)
        }
    },
    { immediate: true, deep: true },
)
watch(
    () => currentNote.value,
    () => {
        if (currentNote.value) {
            emits("save", toRaw(currentNote.value))
        }
    },
    { deep: true },
)

const editTitleIndex = ref(-1)

async function onCopy(text?: any) {
    if (text) {
        await _agent.call("func.copyText", text.content)
        toast("复制成功")
    }
}

const curLanugage = computed(() => {
    if (!currentNote.value) return
    if (!currentNote.value.files[currentNote.value.activeFileIndex]) return ""
    let title = currentNote.value.files[currentNote.value.activeFileIndex].title
    const file = judgeFile(title)
    return file?.language ?? "txt"
})

function createFile() {
    if (!currentNote.value) return
    if (currentNote.value) {
        currentNote.value.activeFileIndex = currentNote.value.files.length
        currentNote.value.files.push({
            title: "文件" + (currentNote.value.files.length + 1),
            content: "",
        })
    }
}
function clickFile(item: ISnipCode, index: number) {
    if (!currentNote.value) return
    currentNote.value.activeFileIndex = index
}
async function removeFile(item: ISnipCode, index: number) {
    if (!currentNote.value) return
    const res = await _agent.call("dialog.confrim", {title: "删除", message: "是否删除？"})
    if(res==1){
        currentNote.value.files.splice(index, 1)
        if (index - 1 >= 0 && !currentNote.value.files[index]) {
            currentNote.value.activeFileIndex = index - 1
        }
    }

}
const vFocus = {
    beforeUnmount(el: HTMLInputElement, binding: any) {
        let data = binding.value
        data.title = el.value
    },
    mounted(el: HTMLInputElement, binding: any) {
        let data = binding.value
        let curFile = judgeFile(data.title)
        if (curFile) {
            let index = curFile.index
            if (curFile.ext && index != undefined) {
                el.setSelectionRange(0, index)
            }
            if (curFile.pre && index != undefined) {
                el.setSelectionRange(index + 1, data.title.length)
            }
        } else {
            el.select()
        }
        el.focus()
    },
}

function contextmenuFile(item: ISnipCode, index: number) {
    let menusArray: IMenuItemOption[] = []
    menusArray.push({
        label: "重命名",
        click() {
            editTitleIndex.value = index // 设置编辑标题的索引
        },
    })
    menusArray.push({
        label: "删除",
        async click() {
            removeFile(item, index)
        },
    })
    const menus = new PopupMenu(menusArray)
    menus.show()
}
</script>
<script lang="ts">
export default defineComponent({
    name: "",
})
</script>

<style lang="less" scoped>
.button {
  text-align: center;
  font-size:15px;
  font-family:Arial;
  padding: 8px;
  border-width:1px;
  color:#fff;
  border-color:#18ab29;
  font-weight:bold;
  border-top-left-radius:28px;
  border-top-right-radius:28px;
  border-bottom-left-radius:28px;
  border-bottom-right-radius:28px;
  text-shadow: 1px 1px 0px #2f6627;
  background:#44c767;
}

.button:hover {
  background: #5cbf2a
}
</style>
