var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "magic-string"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.esbuildPluginMonacoEditorNls = exports.Languages = void 0;
    const fs_1 = __importDefault(require("fs"));
    const path_1 = __importDefault(require("path"));
    const magic_string_1 = __importDefault(require("magic-string"));
    var Languages;
    (function (Languages) {
        Languages["bg"] = "bg";
        Languages["cs"] = "cs";
        Languages["de"] = "de";
        Languages["en_gb"] = "en-gb";
        Languages["es"] = "es";
        Languages["fr"] = "fr";
        Languages["hu"] = "hu";
        Languages["id"] = "id";
        Languages["it"] = "it";
        Languages["ja"] = "ja";
        Languages["ko"] = "ko";
        Languages["nl"] = "nl";
        Languages["pl"] = "pl";
        Languages["ps"] = "ps";
        Languages["pt_br"] = "pt-br";
        Languages["ru"] = "ru";
        Languages["tr"] = "tr";
        Languages["uk"] = "uk";
        Languages["zh_hans"] = "zh-hans";
        Languages["zh_hant"] = "zh-hant";
    })(Languages = exports.Languages || (exports.Languages = {}));
    /**
     * 在vite中dev模式下会使用esbuild对node_modules进行预编译，导致找不到映射表中的filepath，
     * 需要在预编译之前进行替换
     * @param options 替换语言包
     * @returns
     */
    function esbuildPluginMonacoEditorNls(options = { locale: Languages.en_gb }) {
        const CURRENT_LOCALE_DATA = getLocalizeMapping(options.locale);
        return {
            name: 'esbuild-plugin-monaco-editor-nls',
            setup(build) {
                build.onLoad({ filter: /esm\/vs\/nls\.js/ }, async () => {
                    return {
                        contents: getLocalizeCode(CURRENT_LOCALE_DATA),
                        loader: 'js',
                    };
                });
                build.onLoad({ filter: /monaco-editor[\\\/]esm[\\\/]vs.+\.js/ }, async (args) => {
                    return {
                        contents: transformLocalizeFuncCode(args.path, CURRENT_LOCALE_DATA),
                        loader: 'js',
                    };
                });
            },
        };
    }
    exports.esbuildPluginMonacoEditorNls = esbuildPluginMonacoEditorNls;
    /**
     * 使用了monaco-editor-nls的语言映射包，把原始localize(data, message)的方法，替换成了localize(path, data, defaultMessage)
     * vite build 模式下，使用rollup处理
     * @param options 替换语言包
     * @returns
     */
    function default_1(options = { locale: Languages.en_gb }) {
        const CURRENT_LOCALE_DATA = getLocalizeMapping(options.locale);
        return {
            name: 'rollup-plugin-monaco-editor-nls',
            enforce: 'pre',
            load(filepath) {
                if (/esm\/vs\/nls\.js/.test(filepath)) {
                    const code = getLocalizeCode(CURRENT_LOCALE_DATA);
                    return code;
                }
            },
            transform(code, filepath) {
                if (/monaco-editor[\\\/]esm[\\\/]vs.+\.js/.test(filepath) &&
                    !/esm\/vs\/.*nls\.js/.test(filepath)) {
                    CURRENT_LOCALE_DATA;
                    const re = /(?:monaco-editor\/esm\/)(.+)(?=\.js)/;
                    if (re.exec(filepath) && code.includes('localize(')) {
                        const path = RegExp.$1;
                        if (JSON.parse(CURRENT_LOCALE_DATA)[path]) {
                            code = code.replace(/localize\(/g, `localize('${path}', `);
                        }
                        return {
                            code: code,
                            /** 使用magic-string 生成 source map */
                            map: new magic_string_1.default(code).generateMap({
                                includeContent: true,
                                hires: true,
                                source: filepath,
                            }),
                        };
                    }
                }
            },
        };
    }
    exports.default = default_1;
    /**
     * 替换调用方法接口参数，替换成相应语言包语言
     * @param filepath 路径
     * @param CURRENT_LOCALE_DATA 替换规则
     * @returns
     */
    function transformLocalizeFuncCode(filepath, CURRENT_LOCALE_DATA) {
        let code = fs_1.default.readFileSync(filepath, 'utf8');
        const re = /(?:monaco-editor\/esm\/)(.+)(?=\.js)/;
        if (re.exec(filepath)) {
            const path = RegExp.$1;
            if (JSON.parse(CURRENT_LOCALE_DATA)[path]) {
                code = code.replace(/localize\(/g, `localize('${path}', `);
            }
        }
        return code;
    }
    /**
     * 获取语言包
     * @param locale 语言
     * @returns
     */
    function getLocalizeMapping(locale) {
        const locale_data_path = path_1.default.join(__dirname, `./locale/${locale}.json`);
        return fs_1.default.readFileSync(locale_data_path);
    }
    /**
     * 替换代码
     * @param CURRENT_LOCALE_DATA 语言包
     * @returns
     */
    function getLocalizeCode(CURRENT_LOCALE_DATA) {
        return `
        function _format(message, args) {
            var result;
            if (args.length === 0) {
                result = message;
            } else {
                result = String(message).replace(/\{(\d+)\}/g, function (match, rest) {
                    var index = rest[0];
                    return typeof args[index] !== 'undefined' ? args[index] : match;
                });
            }
            return result;
        }

        export function localize(path, data, defaultMessage) {
            var key = typeof data === 'object' ? data.key : data;
            var data = ${CURRENT_LOCALE_DATA} || {};
            var message = (data[path] || {})[key];
            if (!message) {
                message = defaultMessage;
            }
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            return _format(message, args);
        }
    `;
    }
});
