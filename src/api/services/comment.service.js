const { hash } = require('bcrypt');
const CommentModel = require('../models/comment.model.js');
const PostModel = require('../models/post.model.js');

exports.getComments = async id => {
    const post = await PostModel.findById(id)
        .populate('comments')
        .lean();

    const comment = await CommentModel.find({ post: post._id }).lean();

    return [comment];
};

exports.createComment = async (id, username, description) => {
    const uniqueString = hash(12);
    const comment = new CommentModel({
        _id: uniqueString,
        post: id,
        author: username,
        description: description
    });

    await comment.save();
    const postById = await PostModel.findById(id);
    postById.comments.push(comment._id);
    await postById.save();
};
