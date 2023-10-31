const validator = require('validator');
const AppError = require('../../utils/errors/AppError.js');
const { CodeEnum } = require('../../utils/statusCodes.util.js');
const { userService } = require('../services/index.js');
const CatchError = require('../../utils/errors/CatchError.js');

exports.getUser = CatchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(
            new AppError('id cannot be empty', 400, CodeEnum.ProvideValues)
        );
    }
    const user = await userService.getUser(id);
    res.status(200).json({
        status: 'success',
        data: user
    });
});

exports.updateUser = CatchError(async (req, res, next) => {
    const { id } = req.user;
    const { name, biography, img } = req.body;
    const validBody = { name, biography, img };
    if (req.body.password) {
        return next(
            new AppError(`Don't update password`, 400, CodeEnum.WrongValues)
        );
    }

    if (req.body.email) {
        return next(
            new AppError(`You can't change email`, 400, CodeEnum.WrongValues)
        );
    }

    const updatedData = await userService.updateUser(id, validBody);
    res.status(200).json({
        status: 'success',
        data: updatedData
    });
});

exports.checkUsernameAvailable = CatchError(async (req, res, next) => {
    const { username } = req.params;

    if (!username) {
        return next(
            new AppError('Provide username', 400, CodeEnum.ProvideValues)
        );
    }

    const data = await userService.checkUsernameAvailable(username);
    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.changePassword = CatchError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(
            new AppError(
                'Please provide current password, new password and confirm password!',
                400
            )
        );
    }
    const data = await userService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
        confirmPassword
    );
    if (data instanceof AppError) {
        return next(data);
    }

    res.status(200).json({
        status: 'success',
        message: 'Password updated'
    });
});

exports.getUserFollowers = CatchError(async (req, res, next) => {
    const { id } = req.params;

    if (!id || validator.isEmpty(id)) {
        return next(new AppError('Provide Id', 400, CodeEnum.ProvideValues));
    }

    const usersArray = await userService.getUserFollowers(id);
    res.status(200).json({
        status: 'success',
        data: usersArray
    });
});

exports.getUserFollowings = CatchError(async (req, res, next) => {
    const { id } = req.params;

    if (!id || validator.isEmpty(id)) {
        return next(new AppError('Provide Id', 400, CodeEnum.ProvideValues));
    }

    const usersArray = await userService.getUserFollowings(id);
    res.status(200).json({
        status: 'success',
        data: usersArray
    });
});

exports.followUser = CatchError(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId || !validator.isMongoId(userId)) {
        return next(
            new AppError('Provide user Id', 400, CodeEnum.ProvideValues)
        );
    }

    const data = await userService.followUser(req.user.id, userId);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'User followed'
    });
});

exports.unfollowUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId || !validator.isMongoId(userId)) {
        throw {
            code: CodeEnum.ProvideValues,
            message: 'Both of id cannot be empty'
        };
    }
    const data = await userService.unfollowUser(req.user.id, userId);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'User unfollowed'
    });
};
