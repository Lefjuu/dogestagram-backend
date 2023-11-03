const { hash } = require('bcrypt');
const CommentModel = require('../models/comment.model.js');
const PostModel = require('../models/post.model.js');
const { postService } = require('./index.js');
const AppError = require('../../utils/errors/AppError.js');
const { CodeEnum } = require('../../utils/statusCodes.util.js');

exports.getComment = async id => {
    return await CommentModel.findById(id).lean();
};

exports.getCommentsByPostId = async id => {
    const post = await PostModel.findById(id)
        .populate('comments')
        .lean();

    if (!post) {
        return new AppError('Post not found', 400, CodeEnum.PostNotExist);
    }

    const comment = await CommentModel.find({ post: post._id }).lean();

    return [comment];
};

exports.createComment = async (userId, description, postId) => {
    // const uniqueString = hash(12);
    console.log(postId);
    const post = await PostModel.findById(postId);
    console.log(post);
    const comment = await CommentModel.create({
        post: postId,
        userId: userId,
        description: description
    });
    post.comments.push(comment._id);
    await post.save();
    return comment;
};
