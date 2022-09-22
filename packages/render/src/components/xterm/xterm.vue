<template>
    <div class="xterm-wrapper" ref="wrapperEl">
        <div id="terminal"></div>
    </div>
</template>

<script lang="ts" setup>
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import {ResizeObserver} from '@juggle/resize-observer';

import {
    Terminal
} from 'xterm';
const wrapperEl = ref<HTMLDivElement>()

let term: Terminal
let fitAddon: FitAddon
let pid = -1
const resizeObserver = new ResizeObserver(entries => {
    console.log("111");
    if(fitAddon){
        //回调
        fitAddon.fit();
    }
});
onMounted(async () => {
    const res = await _agent.call("pty.init")
    console.log(res);
    pid = res
    term = new Terminal({
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
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal') as HTMLDivElement);
    fitAddon.fit();

    //监听对应的dom
    resizeObserver.observe(wrapperEl.value as HTMLDivElement);

    wrapperEl.value?.addEventListener("resize", function(){
        console.log(2342);
        
        fitAddon.fit();
    })
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
})
onBeforeUnmount(() => {
    window.onresize = null
    if (pid != -1 && term) {
        _agent.send("terminal-close-" + pid);
    }
    resizeObserver.disconnect()
})

</script>