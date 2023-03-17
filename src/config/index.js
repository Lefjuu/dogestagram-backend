import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Env
import dotenv from 'dotenv'
dotenv.config()

export const BASE_PATH = path.normalize(`${__dirname}/..`)

export const PROJECT_MODE = process.env.PROJECT_MODE

export const PROJECT_NAME = process.env.PROJECT_NAME

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME

export const SERVER_PORT = process.env.SERVER_PORT

export const SWAGGER_HOSTNAME = process.env.SWAGGER_HOSTNAME

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const MONGODB_HOSTNAME = process.env.MONGODB_HOSTNAME

export const MONGODB_PORT = process.env.MONGODB_PORT

export const MONGODB_DATABASE = process.env.MONGODB_DATABASE

export const MONGODB_USERNAME = process.env.MONGODB_USERNAME

export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

export const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME

export const REDIS_PORT = process.env.REDIS_PORT

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD

export const AUTH_EMAIL = process.env.AUTH_EMAIL

export const AUTH_PASS = process.env.AUTH_PASS

export const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME

export const REDIS_TTL = {
    trimester: 7776000
}
