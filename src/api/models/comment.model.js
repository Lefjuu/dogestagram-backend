import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema({
    post: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Comment', CommentSchema)