import Redis from 'ioredis'
import { REDIS_HOSTNAME, REDIS_PORT, REDIS_PASSWORD } from '../config/index.js'

let redis

const connect = () =>
    new Promise((resolve, reject) => {
        const r = new Redis(
<<<<<<< HEAD
            // REDIS_PASSWORD
            // ? `redis://:${REDIS_PASSWORD}@${REDIS_HOSTNAME}${REDIS_PORT}/0`
            // : `redis://${REDIS_HOSTNAME}:${REDIS_PORT}`
            'rediss://red-cft8apqrrk0c8352qoag:p7UzzKXXXPWkfKZumYuN74m2ieQFHrc6@frankfurt-redis.render.com:6379'
        )
        // console.log(`redis://${REDIS_HOSTNAME}:${REDIS_PORT}`)

=======
            "rediss://red-cft8apqrrk0c8352qoag:p7UzzKXXXPWkfKZumYuN74m2ieQFHrc6@frankfurt-redis.render.com:6379"
)
>>>>>>> 0095b0228e3a89a7d8d5220f4343954c675f18f2
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
