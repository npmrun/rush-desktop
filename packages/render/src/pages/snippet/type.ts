import { INiuTreeKey } from "princess-ui"

export interface ISnip {
    key: string
    activeFileIndex: number
    title: string
    desc?: string
    from: INiuTreeKey
    fromText: string
    files: ISnipCode[]
}

export interface ISnipCode{
    title: string
    content: string
}


