import mongoose from 'mongoose'
import AutoIncrement from 'mongoose-sequence'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const PostSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    likes: {
        type: Array
    },
    comments: [{
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Comment'
        }
    }]
}, { timestamps: true })

export default mongoose.model('Post', PostSchema)