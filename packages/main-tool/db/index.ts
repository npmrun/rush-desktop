import { Low, JSONFile, Adapter } from '@commonify/lowdb'
import { mainConfig } from '@rush-desktop/main/config'
import path from 'path'
import fs from 'fs-extra'

const Modules: Record<string, CustomLow<any>> = {}

class CustomAdapter<T> extends JSONFile<T> {
    constructor(filepath: string) {
        super(filepath)
        this.filepath = filepath
    }
    filepath: string = ''
    async read() {
        if(!fs.existsSync(this.filepath)){
            return null
        }
        let data = fs.readJSONSync(this.filepath, {throws: false})
        if(!data){
            return null
        }
        return data
    }

    async write(data: T) {
        fs.ensureFileSync(this.filepath)
        await super.write(data)
    }
}
class CustomLow<T> extends Low<T> {
    constructor(adapter: CustomAdapter<T>) {
        super(adapter)
        this.filepath = adapter.filepath
    }
    filepath: string = ''
}

function create(filepath: string) {
    let adapter = new CustomAdapter<any>(filepath)
    const db = new CustomLow<any>(adapter)
    db.filepath = filepath
    return db
}

/**
 * 获取数据库实例，用于操作JSON数据库
 * @param dbName 数据库名字
 * @returns 数据库实例
 */
function getDB(dbName: string) {
    if (!dbName) return
    if (dbName && Modules[dbName] === undefined) {
        let filepath = path.resolve(mainConfig.storagePath, './db/'+dbName + '.json')
        Modules[dbName] = create(filepath)
        return Modules[dbName]
    } else if (dbName && Modules[dbName] != undefined) {
        let cur = Modules[dbName]
        let filepath = path.resolve(mainConfig.storagePath, './db/'+dbName + '.json')
        if(cur.filepath != filepath){
            Modules[dbName] = create(filepath)
        }
        return Modules[dbName]
    }
}

//TODO 考虑自己自定义一个adapter

/**
 * 异步报错数据库的数据，写入时不存在该文件的时候也会报错
 * @param dbName 数据库名字
 * @returns 数据库数据
 */
async function saveData(data: any): Promise<any>
async function saveData(dbName: string, data: any): Promise<any>
async function saveData(dbName: string, data?: any): Promise<any> {
    let db = null
    let rData = null
    if (arguments.length === 2) {
        db = getDB(dbName)
        rData = data
    } else {
        db = getDB('db')
        rData = dbName
    }
    if (db) {
        db.data = rData
        await db.write()
        return db.data
    }
    return null
}

/**
 * 异步获取数据库的数据，首次创建的时候如果是空白文件会报错，这里就catch一下
 * @param dbName 数据库名字
 * @returns 数据库数据
 */
async function getData(dbName?: string) {
    let db = null
    if (dbName) {
        db = getDB(dbName)
    } else {
        db = getDB('db')
    }
    if (db) {
        await db.read()
        return db.data
    }
    return null
}

export { saveData, getData, getDB }
