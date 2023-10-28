const Redis = require('ioredis');
const {
    REDIS_HOSTNAME,
    REDIS_HOSTNAME_DEV,
    REDIS_PORT,
    PROJECT_MODE
} = require('../config/index.js');

let redis;

const connect = () =>
    new Promise((resolve, reject) => {
        let r;
        if (PROJECT_MODE === 'development') {
            r = new Redis(`${REDIS_HOSTNAME_DEV}:${REDIS_PORT}`);
        } else {
            r = new Redis(`${REDIS_HOSTNAME}:${REDIS_PORT}`);
        }

        r.on('connect', function() {
            console.log('✅ Redis: connected!');
            redis = r;
            resolve();
        });

        r.on('error', err => {
            console.error('❌ Redis: error');
            reject(err);
        });
    });

const set = async (...args) => {
    await connect();
    return redis.set(...args);
};

const get = async (...args) => {
    await connect();
    return redis.get(...args);
};

const expire = async (...args) => {
    await connect();
    return redis.expire(...args);
};

module.exports = { connect, redis, set, get, expire };
