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
// UserSchema.plugin(AutoIncrement(mongoose), { id: 'user_seq', inc_field: 'id' })

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

// Indexes
// UserSchema.index({ id: 1 })

export default mongoose.model('User', UserSchema)
