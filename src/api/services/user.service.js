const { default: mongoose } = require('mongoose');
const { deleteFile, uploadFile } = require('../../lib/aws.lib.js');
const AppError = require('../../utils/errors/AppError.js');
const { CodeEnum } = require('../../utils/statusCodes.util.js');
const UserModel = require('../models/user.model.js');
const { v4: uuidv4 } = require('uuid');

exports.getUser = async _id => {
    const user = await UserModel.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(_id)
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
    throw new AppError('User not found', 403, CodeEnum.UserNotFound);
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

exports.unfollowUser = async (id, userId) => {
    const exists = await UserModel.exists({
        _id: userId,
        followers: {
            $ne: [id]
        }
    }).lean();
    if (exists) {
        throw {
            code: CodeEnum.NotFollowed,
            message: 'User not followed'
        };
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

exports.getUserFollowers = async username => {
    const user = await UserModel.findOne({ username }).lean();

    const usersArray = [];
    for (let i = 0; i < user.followers.length; i++) {
        await UserModel.findOne({ _id: user.followers[i] })
            .lean()
            .then(res => {
                usersArray.push(res);
            });
    }

    return usersArray;
};

exports.getUserFollowings = async username => {
    const user = await UserModel.findOne({ username }).lean();

    const usersArray = [];
    for (let i = 0; i < user.followings.length; i++) {
        await UserModel.findOne({ _id: user.followings[i] })
            .lean()
            .then(res => {
                usersArray.push(res);
            });
    }
    return usersArray;
};
