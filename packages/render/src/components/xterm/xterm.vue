<template>
    <div class="xterm-wrapper h-full" ref="wrapperEl">
        <div id="terminal" class="h-full relative" @contextmenu="onContextMenu"></div>
    </div>
</template>

<script lang="ts" setup>
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { CanvasAddon } from 'xterm-addon-canvas';

import {
    Terminal
} from 'xterm';
const wrapperEl = ref<HTMLDivElement>()

let term: Terminal
let fitAddon: FitAddon
let canvas: CanvasAddon
let pid = -1

const fangdou = function (fn: Function, duration: number) {
    let timeid: ReturnType<typeof setTimeout>
    return function () {
        clearTimeout(timeid)
        // @ts-ignore
        let that = this
        timeid = setTimeout(function () {
            fn.call(that, ...arguments)
        }, duration)
    }
}
const resize = fangdou(function () {
    if (fitAddon) {
        //回调
        fitAddon.fit();
    }
}, 500)
useResizeObserver(wrapperEl, resize)

async function onContextMenu() {
    const text = term.getSelection()
    if (text) {
        _agent.call("func.copyText", text)
    }
}

onMounted(async () => {
    term = new Terminal({
        fontFamily: `'DroidSansMono Nerd Font','Droid Sans Mono', Consolas, 'Courier New', monospace`,
        fontSize: 14,
        theme: {
            foreground: '#383a42',
            background: '#fafafa',
            cursor: '#bfceff',

            black: '#383a42',
            brightBlack: '#4f525e',

            red: '#e45649',
            brightRed: '#e06c75',

            green: '#50a14f',
            brightGreen: '#98c379',

            yellow: '#c18401',
            brightYellow: '#e5c07b',

            blue: '#0184bc',
            brightBlue: '#61afef',

            magenta: '#a626a4',
            brightMagenta: '#c678dd',

            cyan: '#0997b3',
            brightCyan: '#56b6c2',

            white: '#fafafa',
            brightWhite: '#ffffff'
        }
    });
    term.open(document.getElementById('terminal') as HTMLDivElement);
    const res = await _agent.call("pty.init", term.cols, term.rows)
    pid = res
    console.log(pid);
    const channels = ["terminal-incomingData-" + pid, "terminal-keystroke-" + pid, "terminal-resize-" + pid, "terminal-close-" + pid];
    term.onData((data) => {
        _agent.send(channels[1], data);
    })
    term.onResize((size) => {
        _agent.send(channels[2], size.cols, size.rows);
    })
    _agent.on(channels[0], (event, data) => {
        term.write(data);
    });
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    canvas = new CanvasAddon()
    term.loadAddon(canvas);

    _agent.send(channels[2], term.cols, term.rows);
    fitAddon.fit()

    // This writes the version number into the terminal window
    term.writeln("<<<<<<<<<<<>>>>>>>>>>");
    term.writeln("   Kaiium V1.1.0");
    term.writeln("<<<<<<<<<<<>>>>>>>>>>");
    // This handles the copy and paste for the pty process
    // term.attachCustomKeyEventHandler((arg) => {
    // if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
    //     navigator.clipboard.readText().then((text) => {
    //         term.write(text);
    //     });
    // }
    // return true;
    // });
})
onBeforeUnmount(() => {
    if (pid != -1 && term) {
        canvas.dispose()
        // fitAddon.dispose()
        term.dispose()
        _agent.send("terminal-close-" + pid);
    }
})

</script>
