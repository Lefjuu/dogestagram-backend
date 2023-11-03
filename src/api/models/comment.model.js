const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
