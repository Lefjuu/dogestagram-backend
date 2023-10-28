const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
    {
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
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
