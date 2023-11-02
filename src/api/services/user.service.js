const { default: mongoose } = require('mongoose');
const { deleteFile, uploadFile } = require('../../lib/aws.lib.js');
const AppError = require('../../utils/errors/AppError.js');
const { CodeEnum } = require('../../utils/statusCodes.util.js');
const UserModel = require('../models/user.model.js');
const { v4: uuidv4 } = require('uuid');

exports.getUser = async query => {
    let user;
    if (query.id) {
        user = await UserModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(query.id)
                }
            },
            {
                $project: {
                    followersCount: { $size: '$followers' },
                    followingsCount: { $size: '$followings' },
                    username: 1,
                    name: 1,
                    img: 1
                }
            }
        ]);
    } else if (query.username) {
        user = await UserModel.aggregate([
            {
                $match: {
                    username: query.username
                }
            },
            {
                $project: {
                    followersCount: { $size: '$followers' },
                    followingsCount: { $size: '$followings' },
                    username: 1,
                    name: 1,
                    img: 1
                }
            }
        ]);
    }
    if (user) {
        if (user.deleted_at)
            throw new AppError(
                'The user has been banned',
                400,
                CodeEnum.UserBanned
            );
        return user[0];
    }
    throw new AppError('User not found', 400, CodeEnum.UserNotFound);
};

exports.checkUsernameAvailable = async username => {
    const user = await UserModel.findOne({ username });
    if (user) {
        return false;
    } else {
        return true;
    }
};

exports.updateUser = async (id, body) => {
    await UserModel.findOne({ _id: id }).then(async res => {
        if (res === null) {
            throw {
                code: CodeEnum.UserNotFound,
                message: 'User not found'
            };
        }
        // TODO: TO CHECK
        if (body.img) {
            deleteFile(res.img);
            const FileId = uuidv4();
            const result = await uploadFile(body.img, FileId);
            body.img = result.Location;
            s;
        }
    });
    const updatedData = await UserModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
        runValidators: true
    }).then(res => {
        return res;
    });
    return updatedData;
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
    const user = await UserModel.findById(userId).select('+password');

    if (
        !user ||
        !(await user.correctPassword(currentPassword, user.password))
    ) {
        throw new AppError('Incorrect password', 400);
    }

    if (!user) {
        throw new AppError('User not found', 400);
    }

    user.password = newPassword;
    await user.save();
    return user;
};

exports.getUserFollowers = async id => {
    const user = await UserModel.findById(id).lean();
    if (!user) {
        throw new AppError(`User not found`, 400, CodeEnum.UserNotFound);
    }

    const usersArray = [];
    for (let i = 0; i < user.followers.length; i++) {
        await UserModel.findOne({ _id: user.followers[i] })
            .select(
                '-password -email -liked -permissions -active -deleted_at -__v -followers -followings'
            )
            .lean()
            .then(res => {
                usersArray.push(res);
            });
    }
    return usersArray;
};

exports.getUserFollowings = async id => {
    const user = await UserModel.findById(id).lean();
    if (!user) {
        throw new AppError(`User not found`, 400, CodeEnum.UserNotFound);
    }

    const usersArray = [];
    for (let i = 0; i < user.followings.length; i++) {
        await UserModel.findOne({ _id: user.followings[i] })
            .select(
                '-password -email -liked -permissions -active -deleted_at -__v -followers -followings'
            )
            .lean()
            .then(res => {
                usersArray.push(res);
            });
    }
    return usersArray;
};

exports.followUser = async (id, userId) => {
    const exists = await UserModel.exists({
        _id: userId,
        followers: {
            $in: [id]
        }
    }).lean();
    if (exists) {
        throw new AppError(
            'Already followed user',
            400,
            CodeEnum.AlreadyFollowed
        );
    }
    const userToFollowExists = await UserModel.exists({
        _id: id
    }).lean();
    if (!userToFollowExists) {
        throw new AppError(
            'User to follow not exists',
            400,
            CodeEnum.UserNotFound
        );
    }
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $push: {
                followers: id
            }
        }
    );
    await UserModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $push: {
                followings: userId
            }
        }
    );
};

exports.unfollowUser = async (id, userId) => {
    const exists = await UserModel.exists({
        _id: userId,
        followers: {
            $ne: [id]
        }
    }).lean();
    if (exists) {
        throw new AppError('User not followed', 400, CodeEnum.AlreadyFollowed);
    }
    await UserModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $pull: {
                followings: userId
            }
        }
    );
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $pull: {
                followers: id
            }
        }
    );
};

exports.getUserByUsername = async username => {
    const user = await UserModel.aggregate([
        {
            $match: {
                username
            }
        },
        {
            $project: {
                followersCount: { $size: '$followers' },
                followingsCount: { $size: '$followings' },
                username: 1,
                name: 1,
                img: 1
            }
        }
    ]);
    if (user) {
        if (user.deleted_at)
            throw new AppError(
                'The user has been banned',
                400,
                CodeEnum.UserBanned
            );
        return user;
    }
    throw new AppError('User not found', 400, CodeEnum.UserNotFound);
};
