import validator from 'validator'
import UserService from '../services/user.service.js'
import CodeEnum from '../../utils/statusCodes.js'

const getUser = async (req, res) => {
    try {
        const { username } = req.params
        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The username cannot be empty'
            }
        }

        const user = await UserService.getUser(username)
        if (user) {
            const {
                lastLogin,
                date,
                email,
                roles,
                status,
                permissions,
                ...thisUser
            } = user
            return res.status(200).json({ ...thisUser })
        } else {
            return res.sendStatus(401)
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const followUser = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (
            !id ||
            validator.isEmpty(id) ||
            !userId ||
            validator.isEmpty(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Both of id cannot be empty'
            }
        }
        await UserService.followUser(id, userId)
        return res.sendStatus(202)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const unfollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (
            !id ||
            validator.isEmpty(id) ||
            !userId ||
            validator.isEmpty(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Both of id cannot be empty'
            }
        }
        await UserService.unfollowUser(id, userId)
        return res.sendStatus(202)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req

        const updatedData = await UserService.updateUser(id, body)
        res.status(200).json(updatedData)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
const getUserFollowers = async (req, res) => {
    try {
        const { username } = req.params

        const usersArray = await UserService.getUserFollowers(username)
        res.status(200).json(usersArray)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getUserFollowings = async (req, res) => {
    try {
        const { username } = req.params

        const usersArray = await UserService.getUserFollowings(username)
        res.status(200).json(usersArray)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

export default {
    getUser,
    followUser,
    unfollowUser,
    updateUser,
    getUserFollowers,
    getUserFollowings
}
