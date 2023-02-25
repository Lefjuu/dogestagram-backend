import fs from 'fs'
import { BASE_PATH } from '../config/index.js'
import { pathToFileURL } from 'url'

import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import express from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function routes(app) {
    fs.readdirSync(`${BASE_PATH}/api/routers`).forEach((route) => {
        import(pathToFileURL(`${BASE_PATH}/api/routers/${route}`)).then(
            (currentModule) => {
                currentModule.default(app)
            }
        )
    })

    app.use((req, res, next) => {
        if (!req.url.startsWith('/api')) {
            app.use(
                express.static(path.join(__dirname, '../../build/index.html'))
            )
            app.get('*', (req, res) => {
                res.sendFile(
                    path.resolve(__dirname, '../../build', 'index.html')
                )
            })
        }
        next()
    })
}
