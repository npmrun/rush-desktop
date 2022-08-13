import { defineStore } from "pinia"

interface IAction {
    icon: string
    title?: string
    path: string
}

const initTop = [
    // {
    //     icon: "source", // 'files'
    //     title: "编辑器",
    //     path: "/note/note",
    // },
    // {
    //     icon: "files",
    //     title: "代码片段",
    //     path: "/home",
    // },
    // {
    //     icon: "source",
    //     title: "ICON",
    //     path: "/tool/icon",
    // },
    // {
    //     icon: "files",
    //     title: "代码片段",
    //     path: "/about",
    // },
    {
        icon: "files",
        title: "笔记本",
        path: "/snippet/snippet",
    },
    // {
    //     icon: "code",
    //     title: "测试",
    //     path: "/test",
    // }
    {
        icon: 'code', // 'files'
        title: '编辑器',
        path: '/editor/editor',
    },
    {
        icon: 'quadrant', // 'files'
        title: '导航',
        path: '/nav/nav',
    },
    // {
    //     icon: 'quadrant',
    //     title: '四象限学习法',
    //     path: '/quadrant/quadrant',
    // },
    // {
    //     icon: 'quadrant',
    //     title: '运行',
    //     path: '/run/run',
    // },
]
const initBottom = [
    {
        icon: "setting",
        title: "编辑器",
        path: "/setting",
    },
]
export default defineStore("action", {
    state: (): { _top: IAction[]; _bottom: IAction[] } => ({
        _top: initTop,
        _bottom: initBottom,
    }),
    getters: {
        topActions: state => state._top,
        bottomActions: state => state._bottom,
    },
})
