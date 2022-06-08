// import 'monaco-editor/esm/vs/editor/editor.all.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';

// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/html/html.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/css/css.contribution.js';

// 导入全部特性
import * as monaco from "monaco-editor"
// import loader from "@monaco-editor/loader"

// loader.config({
//     // monaco,
//     "vs/nls": {
//         availableLanguages: {
//             "*": "zh-cn", // on the editor, press right click to see the German words
//         },
//     },
// })
// export default () => loader.init()
export { monaco }
