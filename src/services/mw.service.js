const validator = require('validator');
const { check, renew } = require('../utils/jwt.util.js');
const AppError = require('../utils/errors/AppError.js');
const { CodeEnum } = require('../utils/statusCodes.util.js');

exports.mw = (required = []) => async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ msg: 'Token not found' });
        }

        const tokenParts = token.split(' ');

        if (
            tokenParts.length !== 2 ||
            tokenParts[0] !== 'Bearer' ||
            !validator.isJWT(tokenParts[1])
        ) {
            throw new AppError(
                'Invalid token format',
                400,
                CodeEnum.BadRequest
            );
        }

        const decoded = await check(tokenParts[1]);

        if (required.length > 0 && 'permissions' in decoded) {
            const isAuthorized = required.some(permission =>
                decoded.permissions.includes(permission)
            );
            if (!isAuthorized) {
                throw new AppError(
                    'You are not authorized',
                    403,
                    CodeEnum.Forbidden
                );
            }
        }

        await renew(decoded.key);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ msg: error.message });
        } else {
            console.error(error);
            return res.status(403).json({ msg: 'Token expired in redis' });
        }
    }
};
