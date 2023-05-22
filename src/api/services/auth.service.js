const sendResetPasswordEmail = require('../../utils/email.util.js');
const CodeEnum = require('../../utils/statusCodes.js');
const TokenModel = require('../models/token.model.js');
const UserModel = require('../models/user.model.js');

exports.login = async (login, password) => {
    const user = await UserModel.findOne({
        $or: [
            {
                email: login
            },
            {
                username: login
            }
        ]
    })
        .select('+password')
        .lean();

    if (user) {
        if (user.deleted_at)
            throw {
                code: CodeEnum.UserBanned,
                message: `The user has been banned`
            };
        if (!user.password)
            throw {
                code: CodeEnum.ProvidePassword,
                message: `Don't have a password, try to recover password`
            };
        const isMatch = await UserModel.compare(password, user.password);
        if (!isMatch)
            throw {
                code: CodeEnum.WrongPassword,
                message: `Incorrect password`
            };
        return user;
    }
    throw {
        code: CodeEnum.UserNotFound,
        message: `User not found`
    };
};

exports.register = async (email, username, password) => {
    const exists = await UserModel.exists({
        $or: [
            {
                email: email
            },
            {
                username: username
            }
        ]
    });
    if (exists) {
        throw {
            code: CodeEnum.AlreadyExist,
            message: `${email} or ${username} is already registered`,
            params: { email }
        };
    } else {
        const query = {};
        query.img =
            'https://dogestagram.s3.eu-west-2.amazonaws.com/white-user-member-guest-icon-png-image-31634946729lnhivlto5f.png';
        query.username = username;
        query.email = email;
        const user = await UserModel.create({
            ...query,
            password
        });
        return user;
    }
};

exports.sendEmail = async email => {
    await UserModel.findOne({ email })
        .lean()
        .then(res => {
            if (res === null) {
                throw {
                    code: CodeEnum.UserNotFound,
                    message: `User with email: ${email} doesn't exist`
                };
            }
        });

    await sendResetPasswordEmail(email);
};

exports.setNewPassword = async (string, password) => {
    await TokenModel.findOne({
        token: string
    })
        .lean()
        .then(async res => {
            if (res === null) {
                throw {
                    code: CodeEnum.TokenExpired,
                    message: `Token expired`
                };
            }
            if (res.token !== string) {
                throw {
                    code: CodeEnum.RequestTimeout,
                    message: `Token expired 2`
                };
            }
            await UserModel.findOneAndUpdate(
                {
                    email: res.email
                },
                {
                    password: password
                }
            ).lean();
            await TokenModel.findOneAndDelete({
                _id: res._id
            }).lean();
        });
};

exports.me = async userId => {
    return await UserModel.findOne({ _id: userId, deleted_at: null });
};
