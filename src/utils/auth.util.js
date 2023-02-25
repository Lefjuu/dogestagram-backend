import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY, REDIS_TTL } from '../config/index.js'
import { redis } from '../lib/redis.lib.js'
import moment from 'moment'

export const session = async (id, data) => {
    try {
        const key = `${id}:${hash(8)}`
        const token = await sign({ key, ...data })
        console.log(token)
        if (token) {
            await redis.set(
                key,
                moment().toISOString(),
                'EX',
                REDIS_TTL.trimester
            )
            return token
        } else {
            throw 'THe key could not be created'
        }
    } catch (err) {
        console.log(err)
        return null
    }
}

const sign = async (data) => {
    try {
        return await jwt.sign(data, JWT_SECRET_KEY)
    } catch (err) {
        console.log(err)
        return null
    }
}

export const hash = (length) => {
    let result = ''
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

export const check = async (token) => {
    try {
        const decoded = await decode(token)
        const data = await redis.get(decoded.key)
        if (decoded.key) {
            const id = decoded.key.split(':')
            return decoded.key && data ? { ...decoded, id: id[0] } : null
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
        return null
    }
}

const decode = async (token) => {
    try {
        return await jwt.decode(token, JWT_SECRET_KEY)
    } catch (err) {
        console.log(err)
        return null
    }
}

export const renew = async (key) => {
    try {
        await redis.expire(key, REDIS_TTL.trimester)
    } catch (err) {
        console.log(err)
        return null
    }
}
