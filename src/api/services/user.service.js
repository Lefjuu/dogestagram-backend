import { deleteFile, uploadFile } from '../../lib/aws.lib.js'
import CodeEnum from '../../utils/statusCodes.js'
import UserModel from '../models/user.model.js'
import { v4 as uuidv4 } from 'uuid'

const getUser = async (username) => {
    const user = await UserModel.findOne({
        username: username,
        deleted_at: null
    }).lean()
    if (user) {
        if (user.deleted_at)
            throw {
                code: CodeEnum.UserBanned,
                message: `The user has been banned`
            }
        return user
    } else {
        throw {
            code: CodeEnum.UserNotFound,
            message: `User not found`
        }
    }
}

const followUser = async (id, userId) => {
    const exists = await UserModel.exists({
        _id: userId,
        followers: {
            $in: [id]
        }
    }).lean()
    if (exists) {
        throw {
            code: CodeEnum.AlreadyFollowed,
            message: `Already followed user`
        }
    }
    await UserModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $push: {
                followings: userId
            }
        }
    )
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $push: {
                followers: id
            }
        }
    )
    return
}

const unfollowUser = async (id, userId) => {
    const exists = await UserModel.exists({
        _id: userId,
        followers: {
            $ne: [id]
        }
    }).lean()
    if (exists) {
        throw {
            code: CodeEnum.NotFollowed,
            message: `User not followed`
        }
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
    )
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $pull: {
                followers: id
            }
        }
    )
}

const updateUser = async (id, body) => {
    await UserModel.findOne({ _id: id }).then(async (res) => {
        if (res === null) {
            throw {
                code: CodeEnum.UserNotFound,
                message: `User not found`
            }
        }
        if (body.img) {
            deleteFile(res.img)
            const FileId = uuidv4()
            const result = await uploadFile(body.img, FileId)
            body.img = result.Location
        }
    })
    const updatedData = await UserModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
        runValidators: true
    }).then((res) => {
        return res
    })
    return updatedData
}

const getUserFollowers = async (username) => {
    const user = await UserModel.findOne({ username }).lean()

    const usersArray = []
    for (let i = 0; i < user.followers.length; i++) {
        await UserModel.findOne({ _id: user.followers[i] })
            .lean()
            .then((res) => {
                usersArray.push(res)
            })
    }

    return usersArray
}

const getUserFollowings = async (username) => {
    const user = await UserModel.findOne({ username }).lean()

    const usersArray = []
    for (let i = 0; i < user.followings.length; i++) {
        await UserModel.findOne({ _id: user.followings[i] })
            .lean()
            .then((res) => {
                usersArray.push(res)
            })
    }
    return usersArray
}

export default {
    getUser,
    followUser,
    unfollowUser,
    updateUser,
    getUserFollowers,
    getUserFollowings
}
