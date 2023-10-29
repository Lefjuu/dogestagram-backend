const jwt = require('jsonwebtoken');
const {
    JWT_SECRET_ACCESS_KEY,
    JWT_SECRET_REFRESH_KEY,
    REDIS_TTL,
    JWT_ACCESS_EXPIRES_IN
} = require('../config/index.js');
const { set, get, expire } = require('../lib/redis.lib.js');
const moment = require('moment');

const generateAccessToken = id => {
    return jwt.sign({ userId: id }, JWT_SECRET_ACCESS_KEY, {
        expiresIn: '15m'
    });
};

const generateRefreshToken = id => {
    return jwt.sign({ userId: id }, JWT_SECRET_REFRESH_KEY, {
        expiresIn: '7d'
    });
};

const sign = async data => {
    try {
        return await jwt.sign(data, JWT_SECRET_ACCESS_KEY);
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

const generateAccessTokenWithUser = async (user, req, res) => {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const secure = req
        ? req.secure || req.headers['x-forwarded-proto'] === 'https'
        : false;

    if (req) {
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure
        });
    }

    user.password = undefined;

    return {
        status: 'success',
        accessToken,
        refreshToken,
        data: {
            user
        }
    };
};

const generateAccessTokenOnly = id => {
    return generateAccessToken(id);
};

const session = async (id, data) => {
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

const check = async token => {
    try {
        const decoded = await jwt.verify(token, JWT_ACCESS_EXPIRES_IN);
        const data = await get(decoded.key);
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

const renew = async key => {
    try {
        await expire(key, REDIS_TTL.trimester);
    } catch (err) {
        console.error('Error renewing session:', err);
        return null;
    }
};

module.exports = {
    generateAccessTokenWithUser,
    generateAccessTokenOnly,
    session,
    check,
    renew
};
