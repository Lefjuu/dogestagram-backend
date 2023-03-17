import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

import TokenModel from '../api/models/token.model.js'
import { AUTH_EMAIL, AUTH_PASS, CLIENT_HOSTNAME } from '../config/index.js'

const sendResetPasswordEmail = async (email) => {
    const currentUrl = `${CLIENT_HOSTNAME}/new-password/`

    function makeId(length) {
        let result = ''
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            )
        }
        return result
    }

    const uniqueString = makeId(200)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: AUTH_EMAIL,
            pass: AUTH_PASS
        }
    })

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Reset your password',
        html: `<p>Someone (hopefully you) has requested a password reset for your dogestagram account. Follow the link below to set a new password:</p><p>This link <b>expires in 6 hours</b>.</p>
        <p> Press <a href=${currentUrl + uniqueString}> here </a>`
    }
    const newId = uuidv4()

    const newToken = new TokenModel({
        _id: newId,
        token: uniqueString,
        email: email
    })

    await newToken.save()

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

export default sendResetPasswordEmail
