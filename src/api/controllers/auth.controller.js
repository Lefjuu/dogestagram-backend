const validator = require('validator');
const AppError = require('../../utils/errors/AppError.js');
const { authService } = require('../services/index.js');
const { generateAccessTokenWithUser } = require('../../utils/jwt.util.js');
const { CodeEnum } = require('../../utils/statusCodes.js');
const CatchError = require('../../utils/errors/CatchError.js');

exports.register = CatchError(async (req, res, next) => {
    const { email, username, password } = req.body;

    if (!email || validator.isEmpty(email)) {
        return next(
            new AppError(
                'The email cannot be empty',
                400,
                CodeEnum.ProvideValues
            )
        );
    }

    if (!username || validator.isEmpty(username)) {
        return next(
            new AppError(
                'The username cannot be empty',
                400,
                CodeEnum.ProvideValues
            )
        );
    }

    if (!password || validator.isEmpty(password)) {
        return next(
            new AppError(
                'The password cannot be empty',
                400,
                CodeEnum.ProvideValues
            )
        );
    }
    const url = `${req.protocol}://${req.get('host')}/api/auth/verify/`;
    const data = await authService.register(req.body, url);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(201).json({
        status: 'success',
        message: 'Verification account email sent'
    });
});

exports.login = CatchError(async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || validator.isEmpty(login)) {
        return next(
            new AppError(
                'The login cannot be empty',
                400,
                CodeEnum.ProvideValues
            )
        );
    }

    if (!password || validator.isEmpty(password)) {
        return next(
            new AppError(
                'The password cannot be empty',
                400,
                CodeEnum.ProvideValues
            )
        );
    }

    const user = await authService.login(login, password);
    if (user instanceof AppError) {
        return next(user);
    }
    if (user) {
        const response = await generateAccessTokenWithUser(user, req, res);

        return res.status(200).json(response);
    }
    return next(
        new AppError('Invalid credentials', 400, CodeEnum.InvalidCredentials)
    );
});

exports.verify = CatchError(async (req, res, next) => {
    const data = await authService.verify(req.params.token);
    console.log(data);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'Your account has been activated'
    });
});

exports.me = CatchError(async (req, res, next) => {
    const userId = req.user.id;

    if (validator.isEmpty(userId)) {
        throw {
            code: CodeEnum.ProvideValues,
            message: 'The User id cannot be empty'
        };
    }

    if (!validator.isMongoId(userId)) {
        throw {
            code: CodeEnum.UserNotExist,
            message: 'Invalid auth User id'
        };
    }

    if (userId) {
        const data = await authService.me(userId);
        return data ? res.status(200).json(data) : res.sendStatus(401);
    }
    return res.status(401).json(res);
});

exports.forgotPassword = CatchError(async (req, res, next) => {
    const { email } = req.body;

    if (!email || validator.isEmpty(email)) {
        return next(
            new AppError('Email cannot be empty', 400, CodeEnum.ProvideValues)
        );
    }
    const url = `${req.protocol}://${req.get('host')}/api/auth/new-password/`;

    const data = await authService.forgotPassword(email, url);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).send('email sent');
});

exports.setNewPassword = CatchError(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    const { string } = req.params;

    if (
        !password ||
        validator.isEmpty(password) ||
        !passwordConfirm ||
        validator.isEmpty(passwordConfirm)
    ) {
        return next(
            new AppError('Provide both passwords', 400, CodeEnum.ProvideValues)
        );
    }
    if (password !== passwordConfirm) {
        return next(
            new AppError(
                'Passwords are not this same',
                400,
                CodeEnum.WrongValues
            )
        );
    }
    await authService.setNewPassword(string, password);
    res.sendStatus(202);
});
