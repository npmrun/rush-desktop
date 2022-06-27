import fs from "fs-extra";

export function readFile(path: string){
    fs.readFile(path, (err: Error, data:any)=>{
        if(err) {
            
        }
    })
}