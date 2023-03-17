import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { CLIENT_HOSTNAME, PROJECT_MODE } from '../config/index.js'
import rateLimit from 'express-rate-limit'

const create = async (app) => {
    app.use(
        bodyParser.json({
            limit: '25mb',
            extended: true
        })
    )
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(compression())
    const corsOptions = {
        origin: CLIENT_HOSTNAME,
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 204
    }

    app.use(cors(corsOptions))

    app.use(methodOverride())

    // app.use(
    //     rateLimit({
    //         windowMs: 1 * 60 * 1000, // 1 minutes
    //         max: 1000, // limit each ip to 1000 requests per windowMs
    //         message: 'You have exceeded the  requests in 1 minute limit!',
    //         headers: true
    //     })
    // )
    app.use(cookieParser())

    app.use(helmet())

    if (PROJECT_MODE === 'development') app.use(morgan('dev'))
}

export { create }
