import { getData, saveData } from "@rush-desktop/main-tool/db"

let allData = {
    allSnippet: [],
    allFolder: []
}

async function flushData() {
    const data = await getData("snippet") || {}
    allData.allFolder = data.allFolder || []
    allData.allSnippet = data.allSnippet || []
    return allData
}

async function storeData(data) {
    await saveData("snippet", data)
    allData = data
}

export {
    allData,
    flushData,
    storeData
}