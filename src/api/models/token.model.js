const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
    {
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
);

module.exports = mongoose.model('Token', TokenSchema);
