//  mockProdServer.ts

import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly
// You can use the import.meta.glob function to import all
const modules = import.meta.globEager('./mock/**/*.ts')
export function setupProdMockServer() {
    let list: any[] = []
    for (const path in modules) {
        const module = modules[path]
        let mod = module.default || module
        list = list.concat(mod)
    }
    createProdMockServer(list)
}
