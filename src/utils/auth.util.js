const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, REDIS_TTL } = require('../config/index.js');
const { redis, set } = require('../lib/redis.lib.js');
const moment = require('moment');

const sign = async data => {
    try {
        return await jwt.sign(data, JWT_SECRET_KEY);
    } catch (err) {
        return null;
    }
};

const hash = length => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

exports.session = async (id, data) => {
    try {
        const key = `${id}:${hash(8)}`;
        const token = await sign({ key, ...data });
        if (token) {
            await set(key, moment().toISOString(), 'EX', REDIS_TTL.trimester);
            return token;
        }
        throw 'The key could not be created';
    } catch (err) {
        return null;
    }
};

exports.check = async token => {
    try {
        const decoded = await decode(token);
        const data = await redis.get(decoded.key);
        if (decoded.key) {
            const id = decoded.key.split(':');
            return decoded.key && data ? { ...decoded, id: id[0] } : null;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const decode = async token => {
    try {
        return await jwt.decode(token, JWT_SECRET_KEY);
    } catch (err) {
        console.log(err);
        return null;
    }
};

exports.renew = async key => {
    try {
        await redis.expire(key, REDIS_TTL.trimester);
    } catch (err) {
        console.log(err);
        return null;
    }
};
