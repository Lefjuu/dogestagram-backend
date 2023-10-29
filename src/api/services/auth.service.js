const Email = require('../../utils/email.util.js');
const sendResetPasswordEmail = require('../../utils/email.util.js');
const AppError = require('../../utils/errors/AppError.js');
const { makeId } = require('../../utils/helper.util.js');
const { CodeEnum } = require('../../utils/statusCodes.util.js');
const TokenModel = require('../models/token.model.js');
const userModel = require('../models/user.model.js');
const UserModel = require('../models/user.model.js');

exports.login = async (login, password) => {
    try {
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
                throw new AppError(
                    'The user has been banned',
                    400,
                    CodeEnum.UserBanned
                );
            if (!user.password)
                throw new AppError(
                    `Don't have a password, try to recover password`,
                    400,
                    CodeEnum.ProvidePassword
                );
            if (!user.active)
                throw new AppError(
                    `Verify your account (check mailbox)`,
                    400,
                    CodeEnum.VerifyAccount
                );
            const isMatch = await UserModel.compare(password, user.password);
            if (!isMatch)
                throw new AppError(
                    `Incorrect login or password`,
                    400,
                    CodeEnum.WrongPassword
                );
            return user;
        }

        throw new AppError(`user not found`, 400, CodeEnum.UserNotFound);
    } catch (error) {
        console.log(error);
        return error;
    }
};

exports.register = async (newUser, url) => {
    try {
        const exists = await UserModel.findOne({
            $or: [
                {
                    email: newUser.email
                },
                {
                    username: newUser.username
                }
            ]
        });

        if (exists) {
            if (newUser.username === exists.username) {
                throw new AppError(
                    `${newUser.username} is already registered`,
                    400,
                    CodeEnum.AlreadyExist
                );
            } else if (newUser.email === exists.email) {
                throw new AppError(
                    `${newUser.email} is already registered`,
                    400,
                    CodeEnum.AlreadyExist
                );
            }
        }
        if (!exists) {
            const user = await UserModel.create(newUser);

            const token = await makeId(50);
            await TokenModel.create({ email: newUser.email, token });
            const urlWithToken = url + token;
            await new Email(user.toObject(), urlWithToken)
                .sendVerificationToken()
                .then(() => {
                    return user;
                });
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};

exports.verify = async token => {
    const currentToken = await TokenModel.findOne({
        token: token
    });
    if (!currentToken) {
        return new AppError(`Token expired`, 400, CodeEnum.TokenExpired);
    }

    await UserModel.findOneAndUpdate(
        { email: currentToken.email },
        { active: true }
    );
};

exports.forgotPassword = async (email, url) => {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
        throw new AppError(`User not found`, 400, CodeEnum.UserNotFound);
    }

    const token = await makeId(20);
    await TokenModel.create({
        email,
        token
    });
    const urlWithToken = url + token;
    console.log(user);

    await new Email(user, urlWithToken).sendPasswordReset(email);
};

exports.setNewPassword = async (string, password) => {
    await TokenModel.findOne({
        token: string
    })
        .lean()
        .then(async res => {
            if (res === null) {
                throw new AppError(`Token expired`, 400, CodeEnum.TokenExpired);
            }
            if (res.token !== string) {
                throw new AppError(`Token expired`, 400, CodeEnum.TokenExpired);
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
