import Redis from 'ioredis'
import { REDIS_HOSTNAME, REDIS_PORT, REDIS_PASSWORD } from '../config/index.js'

let redis

const connect = () =>
    new Promise((resolve, reject) => {
        const r = new Redis(
            "rediss://red-cft8apqrrk0c8352qoag:p7UzzKXXXPWkfKZumYuN74m2ieQFHrc6@frankfurt-redis.render.com:6379"

        r.on('connect', function () {
            console.log('✅ Redis: connected!')
            redis = r
            resolve()
        })

        r.on('error', (err) => {
            console.error('❌ Redis: error')
            reject(err)
        })
    })

export { connect, redis }
