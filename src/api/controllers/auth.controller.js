import validator from 'validator'
import AuthService from '../services/auth.service.js'
import { session } from '../../utils/auth.util.js'
import CodeEnum from '../../utils/statusCodes.js'

const login = async (req, res) => {
    try {
        const { login, password } = req.body

        if (!login || validator.isEmpty(login)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The login cannot be empty'
            }
        }

        if (!password || validator.isEmpty(password)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The password cannot be empty'
            }
        }

        const user = await AuthService.login(login, password)
        if (user) {
            const { _id, permissions } = user
            const token = await session(_id, { permissions })
            return res.status(200).json({ user, token })
        } else {
            return res.sendStatus(401)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const register = async (req, res) => {
    try {
        const { login, username, password } = req.body

        if (!login || validator.isEmpty(login)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The login cannot be empty'
            }
        }

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The username cannot be empty'
            }
        }

        if (!password || validator.isEmpty(password)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The password cannot be empty'
            }
        }

        const data = await AuthService.register(login, username, password)
        let created = '_id' in data || 'n' in data
        return res.status(201).json(created)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const recover = async (req, res) => {
    try {
        const { login } = req.body

        if (!login || validator.isEmpty(login)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The login cannot be empty'
            }
        }

        const data = await AuthService.recover(login)
        return res.status(201).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
}

const me = async (req, res) => {
    try {
        const user_id = req.user.id

        if (validator.isEmpty(user_id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The User id cannot be empty'
            }
        }

        if (!validator.isMongoId(user_id)) {
            throw {
                code: CodeEnum.UserNotExist,
                message: 'Invalid auth User id'
            }
        }

        if (user_id) {
            let data = await AuthService.me(user_id)
            return data ? res.status(200).json(data) : res.sendStatus(401)
        } else {
            return unauthorized(res)
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const sendEmail = async (req, res) => {
    try {
        const { email } = req.body

        if (!email || validator.isEmpty(email)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Email cannot be empty'
            }
        }
        await AuthService.sendEmail(email)
        res.status(200).send('email sended')
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const setNewPassword = async (req, res) => {
    try {
        const { password, repeatedPassword } = req.body
        const { string } = req.params

        if (
            !password ||
            validator.isEmpty(password) ||
            !repeatedPassword ||
            validator.isEmpty(repeatedPassword)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Provide passwords'
            }
        }
        if (password !== repeatedPassword) {
            throw {
                code: CodeEnum.PasswordsNotIdentical,
                message: 'Passwords are not this same'
            }
        }
        await AuthService.setNewPassword(string, password)
        res.sendStatus(202)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

export default {
    login,
    register,
    sendEmail,
    setNewPassword,
    recover,
    me
}
