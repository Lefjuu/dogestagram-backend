import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import AutoIncrement from 'mongoose-sequence'
// import "./hooks/user.hook.js"
import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

// import "./statics/user.static.js"
// import "./methods/user.method.js"

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    username: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        select: false,
        default: null
    },
    biography: {
        type: String
    },
    img: {
        type: String
    },
    followers: {
        type: Array
    },
    followings: {
        type: Array
    },
    liked: {
        type: Array
    },
    permissions: {
        type: Array,
        default: ['user']
    },
    deleted_at: {
        type: Date,
        default: null
    }
})

// Plugins
UserSchema.plugin(aggregatePaginate)

// Statics
UserSchema.statics.compare = async (candidatePassword, password) => {
    return await bcrypt.compareSync(candidatePassword, password)
}

// Hooks
UserSchema.pre('save', async function () {
    const user = this
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10)
        user.password = hash
    }
})

UserSchema.pre('findOneAndUpdate', async function () {
    const user = this._update
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10)
        this._update.password = hash
    }
})

UserSchema.pre('updateMany', async function () {
    const user = this._update
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10)
        this._update.password = hash
    }
})

export default mongoose.model('User', UserSchema)

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           trim: true
 *           unique: true
 *           sparse: true
 *         username:
 *           type: string
 *           unique: true
 *         password:
 *           type: string
 *           select: false
 *           default: null
 *         biography:
 *           type: string
 *         img:
 *           type: string
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fb657df5e286b9b0c152ed"
 *         followings:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fa72158f58d82bb9d35f8a"
 *             - "63fb657df5e286b9b0c152ed"
 *         liked:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fa72348f58d82bb9d35f8f"
 *             - "63fa72348f58d82bb9d35f8f"
 *             - "63fb669ff5e286b9b0c15306"
 *             - "63fb6755f5e286b9b0c15322"
 *             - "63fb6b0df5e286b9b0c15451"
 *             - "63fb6b0df5e286b9b0c15451"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           default: ['user']
 *         deleted_at:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: number
 *           format: int32
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *       example:
 *         _id: 63fa48906dbbfd7ba17ee63b
 *         email: example@gmail.com
 *         username: example
 *         img: https://dogestagram.s3.eu-west-2.amazonaws.com/b083deae-7397-482b-b051-874beb7a297c.jpeg
 *         followers:
 *           - 63fb657df5e286b9b0c152ed
 *         followings:
 *           - 63fa72158f58d82bb9d35f8a
 *           - 63fb657df5e286b9b0c152ed
 *         liked:
 *           - 63fa72348f58d82bb9d35f8f
 *           - 63fa72348f58d82bb9d35f8f
 *           - 63fb669ff5e286b9b0c15306
 *           - 63fb6755f5e286b9b0c15322
 *           - 63fb6b0df5e286b9b0c15451
 *           - 63fb6b0df5e286b9b0c15451
 *         permissions:
 *           - user
 *         deleted_at: null
 *         __v: 0
 *         biography: "12311"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           trim: true
 *           unique: true
 *           sparse: true
 *         username:
 *           type: string
 *           unique: true
 *         biography:
 *           type: string
 *         img:
 *           type: string
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fb657df5e286b9b0c152ed"
 *         followings:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fa72158f58d82bb9d35f8a"
 *             - "63fb657df5e286b9b0c152ed"
 *         liked:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fa72348f58d82bb9d35f8f"
 *             - "63fa72348f58d82bb9d35f8f"
 *             - "63fb6b0df5e286b9b0c15451"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           default: ['user']
 *         deleted_at:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: number
 *           format: int32
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *       example:
 *         _id: 63fa48906dbbfd7ba17ee63b
 *         email: example@gmail.com
 *         username: example
 *         img: https://dogestagram.s3.eu-west-2.amazonaws.com/b083deae-7397-482b-b051-874beb7a297c.jpeg
 *         followers:
 *           - 63fb657df5e286b9b0c152ed
 *         followings:
 *           - 63fa72158f58d82bb9d35f8a
 *           - 63fb657df5e286b9b0c152ed
 *         liked:
 *           - 63fa72348f58d82bb9d35f8f
 *           - 63fa72348f58d82bb9d35f8f
 *           - 63fb669ff5e286b9b0c15306
 *           - 63fb6755f5e286b9b0c15322
 *         permissions:
 *           - user
 *         deleted_at: null
 *         __v: 0
 *         biography: "12311"
 *
 *     UserToken:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI2M2ZhNDg5MDZkYmJmZDdiYTE3ZWU2M2I6NGhqa1dUT0EiLCJwZXJtaXNzaW9ucyI6WyJ1c2VyIl0sImlhdCI6MTY3OTEyMzcwNn0.wkThBUkBRlalj6yqFJ_OqseDebC8HyAg4099JxXSn94
 *           description: JSON Web Token for user authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     publicUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           unique: true
 *         biography:
 *           type: string
 *         img:
 *           type: string
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fb657df5e286b9b0c152ed"
 *         followings:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "63fa72158f58d82bb9d35f8a"
 *             - "63fb657df5e286b9b0c152ed"
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *       example:
 *         _id: 63fa48906dbbfd7ba17ee63b
 *         username: example
 *         img: https://dogestagram.s3.eu-west-2.amazonaws.com/b083deae-7397-482b-b051-874beb7a297c.jpeg
 *         followers:
 *           - 63fb657df5e286b9b0c152ed
 *         followings:
 *           - 63fa72158f58d82bb9d35f8a
 *           - 63fb657df5e286b9b0c152ed
 *         __v: 0
 *         biography: "12311"
 *
 *     UserToken:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI2M2ZhNDg5MDZkYmJmZDdiYTE3ZWU2M2I6NGhqa1dUT0EiLCJwZXJtaXNzaW9ucyI6WyJ1c2VyIl0sImlhdCI6MTY3OTEyMzcwNn0.wkThBUkBRlalj6yqFJ_OqseDebC8HyAg4099JxXSn94
 *           description: JSON Web Token for user authentication
 */
