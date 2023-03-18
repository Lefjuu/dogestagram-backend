import mongoose from './lib/mongoose.lib.js'
import { create } from './lib/express.lib.js'
import express from 'express'
import routes from './services/router.service.js'
import { connect as redis } from './lib/redis.lib.js'
import swagger from './lib/swagger.lib.js'

const app = express()

const init = async () => {
    // express
    await create(app)

    // swagger
    await swagger(app)

    // redis
    await redis()

    // mongoose
    await mongoose()

    // routes
    await routes(app)
}

export { init, app }
