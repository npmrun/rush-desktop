<template>
    <div class="xterm-wrapper h-full" ref="wrapperEl">
        <div id="terminal" class="h-full relative"></div>
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

onMounted(async () => {
    const res = await _agent.call("pty.init")
    console.log(res);
    pid = res
    term = new Terminal({
        fontFamily: `Consolas, 'Courier New', monospace`,
        // fontFamily: `'DroidSansMono Nerd Font','Droid Sans Mono'`,
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
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    canvas = new CanvasAddon()
    term.loadAddon(canvas);
    fitAddon.fit();

    const channels = ["terminal-incomingData-" + pid, "terminal-keystroke-" + pid, "terminal-resize-" + pid, "terminal-close-" + pid];
    term.onData((data) => {
        _agent.send(channels[1], data);
    })
    term.onResize((size) => {
        _agent.send(channels[2], size.cols, size.rows);
    })
    _agent.on(channels[0], (event, data) => {
        console.log(data);
        
        term.write(data);
    });
})
onBeforeUnmount(() => {
    if (pid != -1 && term) {
        canvas.dispose()
        fitAddon.dispose()
        term.dispose()
        _agent.send("terminal-close-" + pid);
    }
})

</script>
