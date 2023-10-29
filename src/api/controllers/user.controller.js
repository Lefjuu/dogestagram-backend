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

    if (username) {
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

exports.followUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (
            !id ||
            !validator.isMongoId(id) ||
            !userId ||
            !validator.isMongoId(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Both of id cannot be empty'
            };
        }
        await UserService.followUser(id, userId);
        return res.sendStatus(202);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (
            !id ||
            !validator.isMongoId(id) ||
            !userId ||
            !validator.isMongoId(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Both of id cannot be empty'
            };
        }
        await UserService.unfollowUser(id, userId);
        return res.sendStatus(202);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getUserFollowers = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Username cannot be empty'
            };
        }

        const usersArray = await UserService.getUserFollowers(username);
        res.status(200).json(usersArray);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getUserFollowings = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Username cannot be empty'
            };
        }

        const usersArray = await UserService.getUserFollowings(username);
        res.status(200).json(usersArray);
    } catch (err) {
        res.status(500).json(err);
    }
};
