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

    // gzip compression
    app.use(compression())

    app.use(methodOverride())

    app.use(
        rateLimit({
            windowMs: 1 * 60 * 1000, // 1 minutes
            max: 1000, // limit each ip to 1000 requests per windowMs
            message: 'You have exceeded the  requests in 24 hrs limit!',
            headers: true
        })
    )
    app.use(cookieParser())

    // app.use(
    //     helmet.contentSecurityPolicy({
    //         useDefaults: true,
    //         directives: {
    //             'img-src': ["'self'", 'https: data:']
    //         }
    //     })
    // )

    // app.use(cors())

    const corsOptions = {
        origin: CLIENT_HOSTNAME,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization']
        // exposedHeaders: ['Content-Type', 'Authorization'],
        // maxAge: 3600,
        // // Add COEP and COOP headers
        // allowedCrossDomain: true,
        // crossOriginEmbedderPolicy: 'require-corp',
        // crossOriginOpenerPolicy: 'same-origin'
    }

    app.use(cors(corsOptions))

    if (PROJECT_MODE === 'development') app.use(morgan('dev'))
}

export { create }
