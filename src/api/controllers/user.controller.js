/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const UserService = require('../services/user.service.js');
const CodeEnum = require('../../utils/statusCodes.util.js');

exports.getUser = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The username cannot be empty'
            };
        }

        const user = await UserService.getUser(username);
        if (user) {
            const {
                lastLogin,
                date,
                email,
                roles,
                status,
                permissions,
                liked,
                ...thisUser
            } = user;
            return res.status(200).json({ ...thisUser });
        }
        return res.sendStatus(401);
    } catch (err) {
        res.status(500).json(err);
    }
};

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

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        const updatedData = await UserService.updateUser(id, body);
        res.status(200).json(updatedData);
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
