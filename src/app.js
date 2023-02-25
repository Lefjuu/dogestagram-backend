import mongoose from './lib/mongoose.lib.js'
import { create } from './lib/express.lib.js'
import express from 'express'
import routes from './services/router.service.js'
import { connect as redis } from './lib/redis.lib.js'

const app = express()

const init = async () => {
    // routes
    await routes(app)
    await redis()
    // mongoose
    await mongoose()

    // express
    await create(app)
}

export { init, app }
