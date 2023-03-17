import fs from 'fs'
import { BASE_PATH } from '../config/index.js'
import { pathToFileURL } from 'url'

export default async function routes(app) {
    fs.readdirSync(`${BASE_PATH}/api/routers`).forEach((route) => {
        import(pathToFileURL(`${BASE_PATH}/api/routers/${route}`)).then(
            (currentModule) => {
                currentModule.default(app)
            }
        )
    })
}
