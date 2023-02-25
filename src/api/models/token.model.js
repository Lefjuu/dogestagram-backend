import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        token: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: '6h' }
        }
    },
    { timestamps: true }
)

export default mongoose.model('Token', TokenSchema)
