import { filter, filterNext, findNode } from "@rush/common/util/treeHelper"
import { getData, saveData } from "@rush/main-tool/db"
import { clone, cloneDeep } from "lodash"
import { flushData, allData, storeData } from "./data"
import { setValue, tempSnippet } from "./snip"

let tempFolder = [] // 临时操作

/**
 * 包裹方法，使其自动错误重试
 * 只能包裹返回Promise的方法
 * 返回promise，可以获取成功的返回值，或最后失败的err
 * 需要运行环境支持ES6的Promise语法，或者使用Bluebird库
 * @param func
 * @param retryMax
 * @returns {funcR}
 */
export function autoRetry(func, retryMax) {
    let retryNum = 0
    let funcName =  'anonymous'
    try {
        funcName = func.name || func.toString().match(/function (\w+)\(/)[1]
    } catch (error) {
        console.error(error)
    }
    return function funcR(...params: any[]) {
        return new Promise((resolve, reject) => {
            func(...params)
                .then(result => {
                    retryNum = 0
                    resolve(result)
                })
                .catch(err => {
                    if (retryNum < retryMax) {
                        console.warn(
                            `[autoRetry] Catched error when ${funcName}() : ${err.message}. Retry ${retryNum} time...`,
                        )
                        setTimeout(() => {
                            retryNum++
                            resolve(funcR(...params))
                        }, 500)
                    } else {
                        reject(err)
                    }
                })
        })
    }
}

const storageData = autoRetry(_storageData, 3)

/**
 * 保存数据到本地
 * @param data 需要存储的数据
 */
async function _storageData(tempFolder, tempSnippet) {
    const data = cloneDeep(allData)
    tempFolder && (data.allFolder = tempFolder)
    tempSnippet && (data.allSnippet = tempSnippet)
    await storeData(data)
}
export { storageData }
/**
 * 读取数据
 */
export async function readData() {
    await flushData()
    tempFolder = cloneDeep(allData.allFolder)
    return allData.allFolder || []
}
export async function add(data, parentKey) {
    try {
        if (parentKey) {
            const node = findNode(
                tempFolder,
                node => {
                    if (node.key === parentKey) {
                        return true
                    }
                    return false
                },
                {
                    id: "key",
                },
            )
            node.children.push(data)
        } else {
            tempFolder.push(data)
        }
        await storageData(tempFolder)
        allData.allFolder = cloneDeep(tempFolder)
    } catch (error) {
        tempFolder = cloneDeep(allData.allFolder)
        throw error
    }
}
export async function expand(key, isExpand) {
    try {
        const node = findByKey(key)
        node.isExpand = isExpand
        await storageData(tempFolder)
        allData.allFolder = cloneDeep(tempFolder)
    } catch (error) {
        tempFolder = cloneDeep(allData.allFolder)
        throw error
    }
}
/**
 * 修改名称回调
 * @param key 节点ID
 * @param newName 修改的名称
 */
export async function rename(key, newName: string) {
    try {
        const data = findNode(
            tempFolder,
            node => {
                if (node.key === key) {
                    return true
                }
                return false
            },
            {
                id: "key",
            },
        )
        data.title = newName
        // 找到节点，修改名称
        await storageData(tempFolder)
        allData.allFolder = cloneDeep(tempFolder)
    } catch (error) {
        tempFolder = cloneDeep(allData.allFolder)
        throw error
    }
}
export async function dels(keys: string[]) {
    try {
        tempFolder = filterNext(
            tempFolder,
            node => {
                if (keys.includes(node.key)) {
                    return false
                }
                return true
            },
            {
                id: "key",
            },
        )
        let list = setValue(tempSnippet.filter(v => !keys.includes(v.from)))
        // 找到节点，修改名称
        await storageData(tempFolder, list)
        allData.allFolder = cloneDeep(tempFolder)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempFolder = cloneDeep(allData.allFolder)
        setValue(cloneDeep(allData.allSnippet))
        throw error
    }
}
// 删除节点回调
export async function del(key) {
    try {
        tempFolder = filterNext(
            tempFolder,
            node => {
                if (node.key === key) {
                    return false
                }
                return true
            },
            {
                id: "key",
            },
        )
        let list = setValue(tempSnippet.filter(v => v.from !== key))
        // 找到节点，修改名称
        await storageData(tempFolder, list)
        allData.allFolder = cloneDeep(tempFolder)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempFolder = cloneDeep(allData.allFolder)
        setValue(cloneDeep(allData.allSnippet))
        throw error
    }
}
function findByKey(key) {
    return findNode(
        tempFolder,
        node => {
            if (node.key === key) {
                return true
            }
            return false
        },
        {
            id: "key",
        },
    )
}
function removeByKey(key) {
    tempFolder = filterNext(
        tempFolder,
        node => {
            if (node.key === key) {
                return false
            }
            return true
        },
        {
            id: "key",
        },
    )
}
// 移动节点回调
export async function move(type, key, targetKey) {
    try {
        if (type == "drag-up") {
            const sourceData = findByKey(key)
            removeByKey(key)
            insertBeforeByKey(targetKey, sourceData, tempFolder)
        }
        if (type == "drag-in") {
            const sourceData = findByKey(key)
            removeByKey(key)
            const targetData = findByKey(targetKey)
            targetData.children.push(sourceData)
            // targetData.isExpand = true
        }
        if (type == "drag-down") {
            const sourceData = findByKey(key)
            removeByKey(key)
            insertAfterByKey(targetKey, sourceData, tempFolder)
        }
        await storageData(tempFolder)
        allData.allFolder = cloneDeep(tempFolder)
    } catch (error) {
        tempFolder = cloneDeep(allData.allFolder)
        throw error
    }
}

function insertBeforeByKey(key, node, treeData) {
    if (!treeData || !treeData.length) {
        return
    }
    for (let i = 0; i < treeData.length; i++) {
        let data = treeData[i]
        if (data.key === key) {
            treeData.splice(i, 0, node)
            break
        }
        if (data && data.children) {
            insertBeforeByKey(key, node, data.children)
        }
    }
}
function insertAfterByKey(key, node, treeData) {
    if (!treeData || !treeData.length) {
        return
    }
    for (let i = 0; i < treeData.length; i++) {
        let data = treeData[i]
        if (data.key === key) {
            treeData.splice(i + 1, 0, node)
            break
        }
        if (data && data.children) {
            insertAfterByKey(key, node, data.children)
        }
    }
}
