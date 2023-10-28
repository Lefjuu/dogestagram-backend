const validator = require('validator');
const { check, renew } = require('../utils/auth.util.js');
const { error } = require('../utils/helper.util.js');

exports.mw = required => {
    return async (req, res, next) => {
        try {
            let token = req.headers.authorization;
            if (token) {
                try {
                    token = token.split(' ')[1];
                    if (!validator.isJWT(token)) throw 'Token is not valid';
                    req.headers.authorization = `Bearer ${token}`;
                    const decoded = await check(token);
                    if (required) {
                        if ('permissions' in decoded) {
                            const isAuthorized = required.filter(x =>
                                decoded.permissions.includes(x)
                            );
                            if (isAuthorized.length === 0)
                                return res.sendStatus(403);
                        }
                    }
                    await renew(decoded.key);
                    req.user = decoded;

                    return next();
                } catch (errSession) {
                    console.log(errSession);
                    return res.sendStatus(401);
                }
            } else {
                return res.status(401).json({ msg: 'Token not found' });
            }
        } catch (err) {
            return error(res, err);
        }
    };
};
