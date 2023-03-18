import mongoose from 'mongoose'
import {
    MONGODB_HOSTNAME,
    MONGODB_DATABASE,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    PROJECT_MODE
} from '../config/index.js'

const db = async () => {
    new Promise((resolve, reject) => {
        if (PROJECT_MODE === 'development') {
            mongoose.set('debug', true)
        }
        mongoose.set('strictQuery', false)

        mongoose.connect(
            MONGODB_USERNAME && MONGODB_PASSWORD
                ? `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}/${MONGODB_DATABASE}?retryWrites=true&w=majority`
                : `mongodb://${MONGODB_HOSTNAME}${PORT}/${MONGODB_DATABASE}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        const db = mongoose.connection

        db.once('connected', () => {
            console.log('✅ MongoDB: connected!')
            resolve()
        })

        db.on('error', (error) => {
            console.error('❌ MongoDB: error')
            reject(error)
        })
    })
}

export default db
