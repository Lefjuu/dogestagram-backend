const validator = require('validator');
const { error } = require('../utils/helper.util.js');
const { check, renew } = require('../utils/jwt.util.js');
const AppError = require('../utils/errors/AppError.js');
const { CodeEnum } = require('../utils/statusCodes.js');

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
                    console.log(decoded);
                    if (required) {
                        if ('permissions' in decoded) {
                            const isAuthorized = required.filter(x =>
                                decoded.permissions.includes(x)
                            );
                            if (isAuthorized.length === 0)
                                return new AppError(
                                    'You are not authorized',
                                    400,
                                    CodeEnum.Unauthorized
                                );
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
