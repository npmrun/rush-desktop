import { cloneDeep } from "lodash"
import { autoRetry } from "."
import { allData, flushData, storeData } from "./data"

export let tempSnippet = [] // 临时操作

export function setValue(list) {
    tempSnippet = list
    return list
}

const storageData = autoRetry(_storageData, 3)

/**
 * 保存数据到本地
 * @param data 需要存储的数据
 */
async function _storageData(tempFolder) {
    const data = cloneDeep(allData)
    data.allSnippet = tempFolder
    await storeData(data)
}
export { storageData }

export async function readData(key) {
    await flushData()
    tempSnippet = cloneDeep(allData.allSnippet) || []
    if (key) {
        return tempSnippet.filter(v => {
            return v.from === key
        })
    } else {
        return tempSnippet
    }
}

export async function add(data) {
    try {
        tempSnippet.push(data)
        await storageData(tempSnippet)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempSnippet = cloneDeep(allData.allSnippet)
        throw error
    }
}
export async function delByFrom(fromKey) {
    try {
        tempSnippet = tempSnippet.filter(v => v.from !== fromKey)
        await storageData(tempSnippet)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempSnippet = cloneDeep(allData.allSnippet)
        throw error
    }
}
export async function dels(keys: any[]) {
    try {
        tempSnippet = tempSnippet.filter(v => !keys.includes(v.key))
        await storageData(tempSnippet)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempSnippet = cloneDeep(allData.allSnippet)
        throw error
    }
}
export async function del(key) {
    try {
        tempSnippet = tempSnippet.filter(v => v.key !== key)
        await storageData(tempSnippet)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempSnippet = cloneDeep(allData.allSnippet)
        throw error
    }
}
export async function modifyByFrom(fromKey, data) {
    try {
        for (let i = 0; i < tempSnippet.length; i++) {
            const element = tempSnippet[i]
            if (element.from === fromKey) {
                tempSnippet[i] = Object.assign(element, data)
            }
        }
        await storageData(tempSnippet)
        allData.allSnippet = cloneDeep(tempSnippet)
    } catch (error) {
        tempSnippet = cloneDeep(allData.allSnippet)
        throw error
    }
}

export async function modify(key, data) {
    try {
        let index = -1
        for (let i = 0; i < tempSnippet.length; i++) {
            const element = tempSnippet[i]
            if (element.key === key) {
                index = i
            }
        }
        if (index > -1) {
            const oData = tempSnippet[index]
            tempSnippet[index] = Object.assign(oData, data)
            await storageData(tempSnippet)
            allData.allSnippet = cloneDeep(tempSnippet)
        }
    } catch (error) {
        tempSnippet = cloneDeep(allData.allSnippet)
        throw error
    }
}
