// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const CodeEnum = require('../../utils/statusCodes.util.js');
const CatchError = require('../../utils/errors/CatchError.js');
const { commentService } = require('../services/index.js');
const AppError = require('../../utils/errors/AppError.js');

exports.createComment = CatchError(async (req, res, next) => {
    const userId = req.user.id;

    if (!validator.isMongoId(req.body.postId)) {
        return next(
            new AppError('Post Id cannot be empty', 400, CodeEnum.ProvideValues)
        );
    }
    const { description, postId } = req.body;

    if (!description || validator.isEmpty(description)) {
        return next(
            new AppError('comment cannot be empty', 400, CodeEnum.ProvideValues)
        );
    }

    const comment = await commentService.createComment(
        userId,
        description,
        postId
    );
    if (comment instanceof AppError) {
        return next(comment);
    }
    res.status(201).json({
        status: 'success',
        data: comment
    });
});

exports.getComment = CatchError(async (req, res, next) => {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
        return next(new AppError('Invalid id', 400, CodeEnum.ProvideValues));
    }

    const comment = await commentService.getComment(id);
    if (comment instanceof AppError) {
        return next(comment);
    }
    res.status(201).json({
        status: 'success',
        data: comment
    });
});

exports.getCommentsByPostId = CatchError(async (req, res, next) => {
    const { postId } = req.query;

    if (!validator.isMongoId(postId)) {
        return next(new AppError('Invalid id', 400, CodeEnum.ProvideValues));
    }

    const comments = await commentService.getCommentsByPostId(postId);

    if (comments instanceof AppError) {
        return next(comments);
    }
    res.status(201).json({
        status: 'success',
        data: comments
    });
});
