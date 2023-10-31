const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

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
        default: null
    },
    password: {
        type: String,
        select: false
    },
    biography: {
        type: String
    },
    img: {
        type: String,
        default:
            'https://dogestagram.s3.eu-west-2.amazonaws.com/white-user-member-guest-icon-png-image-31634946729lnhivlto5f.png'
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

// Plugins
UserSchema.plugin(aggregatePaginate);

// Statics
UserSchema.statics.compare = async function(candidatePassword, password) {
    return bcrypt.compare(candidatePassword, password);
};

UserSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Hooks
UserSchema.pre('save', async function() {
    const user = this;
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    }
});

UserSchema.pre('findOneAndUpdate', async function() {
    const user = this._update;
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10);
        this._update.password = hash;
    }
});

UserSchema.pre('updateMany', async function() {
    const user = this._update;
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10);
        this._update.password = hash;
    }
});

module.exports = mongoose.model('User', UserSchema);
