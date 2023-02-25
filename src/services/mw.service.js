import validator from 'validator'
import { check, renew } from '../utils/auth.util.js'
import { error } from '../utils/helper.util.js'

export const mw = (required) => {
    return async(req, res, next) => {
        try {
            let token = req.headers['authorization']
                // console.log(req.headers)

            // console.log(token)
            if (token) {
                try {
                    token = token.split(' ')[1]
                        // console.log(token)
                    if (!validator.isJWT(token)) throw 'Token is not valid'
                    req.headers.authorization = `Bearer ${token}`
                    const decoded = await check(token)
                        // console.log(decoded)
                    if (required) {
                        if ('permissions' in decoded) {
                            const isAuthorized = required.filter((x) =>
                                decoded.permissions.includes(x)
                            )
                            if (isAuthorized.length === 0) return forbidden(res)
                        }
                    }
                    await renew(decoded.key)
                    req.user = decoded

                    return next()
                } catch (errSession) {
                    console.log(errSession)
                    return res.sendStatus(401)
                }
            } else {
                return res.status(401).json({ msg: 'Token not found' })
            }
        } catch (err) {
            return error(res, err)
        }
    }
}