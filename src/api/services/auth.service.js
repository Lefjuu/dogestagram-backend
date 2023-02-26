// Models
import sendResetPasswordEmail from '../../utils/email.util.js'
import CodeEnum from '../../utils/statusCodes.js'
import TokenModel from '../models/token.model.js'
import UserModel from '../models/user.model.js'

const login = async (login, password) => {
    const user = await UserModel.findOne({
        $or: [
            {
                email: login
            }
        ]
    })
        .select('+password')
        .lean()

    if (user) {
        if (user.deleted_at)
            throw {
                code: CodeEnum.UserBanned,
                message: `The user has been banned`
            }
        if (!user.password)
            throw {
                code: CodeEnum.ProvidePassword,
                message: `Don't have a password, try in recover password`
            }
        const isMatch = await UserModel.compare(password, user.password)
        if (!isMatch)
            throw {
                code: CodeEnum.WrongPassword,
                message: `Incorrect password`
            }
        return user
    } else {
        throw {
            code: CodeEnum.UserNotFound,
            message: `User not found`
        }
    }
}

const register = async (login, username, password, terms) => {
    console.log(login, username, password)
    const exists = await UserModel.exists({
        $or: [
            {
                email: login
            },
            {
                username: username
            }
        ]
    })
    if (exists) {
        throw {
            code: CodeEnum.AlreadyExist,
            message: `${login} is already registered`,
            params: { login }
        }
    } else {
        const query = {}
        query.img =
            'https://dogestagram.s3.eu-west-2.amazonaws.com/3311f24b5f491d4b6d3745ec526506f7.png'
        query.username = username
        query.email = login
        const user = await UserModel.create({
            ...query,
            password,
            check_terms: terms
        })
        return user
    }
}

const sendEmail = async (email) => {
    await UserModel.findOne({ email })
        .lean()
        .then((res) => {
            if (res === null) {
                throw {
                    code: CodeEnum.UserNotFound,
                    message: `User with email : ${email} doesn't exist`
                }
            }
        })

    await sendResetPasswordEmail(email)
    return
}

const setNewPassword = async (string, password) => {
    await TokenModel.findOne({
        token: string
    })
        .lean()
        .then(async (res) => {
            if (res === null) {
                throw {
                    code: CodeEnum.TokenExpired,
                    message: `Token expired`
                }
            }
            if (res.token !== string) {
                throw {
                    code: CodeEnum.RequestTimeout,
                    message: `Token expired 2`
                }
            }
            await UserModel.findOneAndUpdate(
                {
                    email: res.email
                },
                {
                    password: password
                }
            ).lean()
            await TokenModel.findOneAndDelete({
                _id: res._id
            }).lean()
            return
        })
}

const recover = async (login) => {
    const user = await UserModel.findOne({
        $or: [
            {
                email: login
            }
        ],
        deleted_at: null
    }).lean()

    if (user) {
        await UserModel.updateOne({ _id: user._id })

        return {
            sent: `Sent code to ${login}`
        }
    } else {
        throw {
            code: CodeEnum.UserNotFound,
            message: `${login} is not registered`
        }
    }
}

const me = async (user_id) => {
    return await UserModel.findOne({ _id: user_id, deleted_at: null }).select(
        'email name created_at username'
    )
}

export default {
    login,
    register,
    sendEmail,
    setNewPassword,
    recover,
    me
}
