const Redis = require('ioredis');
const { REDIS_HOSTNAME } = require('../config/index.js');

let redis;

const connect = () =>
    new Promise((resolve, reject) => {
        const r = new Redis(REDIS_HOSTNAME);

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

module.exports = { connect, redis, set };
