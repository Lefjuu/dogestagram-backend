const validator = require('validator');
const AuthService = require('../services/auth.service.js');
const { session } = require('../../utils/auth.util.js');
const CodeEnum = require('../../utils/statusCodes.js');

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || validator.isEmpty(login)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The login cannot be empty'
            };
        }

        if (!password || validator.isEmpty(password)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The password cannot be empty'
            };
        }

        const user = await AuthService.login(login, password);
        if (user) {
            const { _id, permissions } = user;
            const token = await session(_id, { permissions });
            return res.status(200).json({ user, token });
        }
        return res.sendStatus(401);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || validator.isEmpty(email)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The email cannot be empty'
            };
        }

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The username cannot be empty'
            };
        }

        if (!password || validator.isEmpty(password)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The password cannot be empty'
            };
        }

        const data = await AuthService.register(email, username, password);
        const created = '_id' in data || 'n' in data;
        return res.status(201).json(created);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.me = async (req, res) => {
    try {
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
            const data = await AuthService.me(userId);
            return data ? res.status(200).json(data) : res.sendStatus(401);
        }
        return res.status(401).json(res);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.sendEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || validator.isEmpty(email)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Email cannot be empty'
            };
        }
        await AuthService.sendEmail(email);
        res.status(200).send('email sended');
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.setNewPassword = async (req, res) => {
    try {
        const { password, repeatedPassword } = req.body;
        const { string } = req.params;

        if (
            !password ||
            validator.isEmpty(password) ||
            !repeatedPassword ||
            validator.isEmpty(repeatedPassword)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Provide passwords'
            };
        }
        if (password !== repeatedPassword) {
            throw {
                code: CodeEnum.PasswordsNotIdentical,
                message: 'Passwords are not this same'
            };
        }
        await AuthService.setNewPassword(string, password);
        res.sendStatus(202);
    } catch (err) {
        res.status(500).json(err);
    }
};
