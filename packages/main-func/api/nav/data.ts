import { getData, saveData } from "@rush/main-tool/db"

// {
//     groupName: "",
//     desc: "",
//     sites: []
// }
let allData = []

async function flushData() {
    allData = await getData("navData") || []
    return allData
}

async function storeData(data) {
    await saveData("navData", data)
    allData = data
}

export {
    allData,
    flushData,
    storeData
}