const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
        comments: [
            {
                comment: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: 'Comment'
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
