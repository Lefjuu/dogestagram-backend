// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const CatchError = require('../../utils/errors/CatchError.js');
const { postService } = require('../services/index.js');
const { CodeEnum } = require('../../utils/statusCodes.util.js');
const AppError = require('../../utils/errors/AppError.js');
const { default: mongoose } = require('mongoose');

exports.getUserPosts = CatchError(async (req, res, next) => {
    const { id, username } = req.query;

    if (!id && !username) {
        return next(
            new AppError('Provide Id or Username', 400, CodeEnum.ProvideValues)
        );
    }

    let posts;
    if (id) {
        if (validator.isMongoId(id)) {
            posts = await postService.getUserPosts({
                userId: id
            });
        }
    } else {
        posts = await postService.getUserPosts({
            username: username
        });
    }

    if (posts instanceof AppError) {
        return next(posts);
    }

    res.status(200).json({
        status: 'success',
        data: posts
    });
});

exports.getPost = CatchError(async (req, res, next) => {
    const { id } = req.params;
    if (!validator.isMongoId(id)) {
        return next(
            new AppError('Provide valid id', 400, CodeEnum.ProvideValues)
        );
    }

    const post = await postService.getPost(id);
    if (post instanceof AppError) {
        return next(post);
    }
    res.status(200).json({
        status: 'success',
        data: post
    });
});

exports.createPost = CatchError(async (req, res, next) => {
    const { img, description } = req.body;

    if (!img || validator.isEmpty(img)) {
        return next(new AppError('Add Image', 400, CodeEnum.ProvideValues));
    }

    const postBody = { img, description, userId: req.user.id };
    const post = await postService.createPost(postBody);
    if (post instanceof AppError) {
        return next(post);
    }

    res.status(200).json({
        status: 'success',
        data: post
    });
});

exports.deletePost = CatchError(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!validator.isMongoId(id)) {
        return next(
            new AppError('Provide valid id', 400, CodeEnum.ProvideValues)
        );
    }

    const post = await postService.deletePost(id, userId);
    if (post instanceof AppError) {
        return next(post);
    }
    if (post === true) {
        res.status(200).json({
            status: 'success',
            data: post
        });
    } else {
        res.status(403).json({
            status: 'failed',
            data: post
        });
    }
});

exports.updatePost = CatchError(async (req, res, next) => {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user.id;

    if (validator.isEmpty(id)) {
        return next(
            new AppError('Post Id cannot be empty', 400, CodeEnum.ProvideValues)
        );
    }
    if (!description || validator.isEmpty(description)) {
        return next(
            new AppError(
                'Description cannot be empty',
                400,
                CodeEnum.ProvideValues
            )
        );
    }

    const updatedPost = await postService.updatePost(id, description, userId);
    if (updatedPost instanceof AppError) {
        return next(updatedPost);
    }

    res.status(200).json({
        status: 'success',
        data: updatedPost
    });
});

exports.likePost = CatchError(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!validator.isMongoId(id)) {
        throw {
            code: CodeEnum.ProvideValues,
            message: 'Post Id cannot be empty'
        };
    }
    const data = await postService.likePost(id, userId);
    if (data instanceof AppError) {
        return next(data);
    }

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.unlikePost = CatchError(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!validator.isMongoId(id)) {
        throw {
            code: CodeEnum.ProvideValues,
            message: 'Post Id cannot be empty'
        };
    }
    const data = await postService.unlikePost(id, userId);
    if (data instanceof AppError) {
        return next(data);
    }

    res.status(200).json({
        status: 'success',
        data: data
    });
});

exports.getTimelineUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            };
        }
        const timeline = await PostService.getTimelineUser(id);
        res.status(200).json(timeline);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getExploreUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            };
        }
        const posts = await PostService.getExploreUser(id);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

// exports.getUserPosts = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id || !validator.isMongoId(id)) {
//             throw {
//                 code: CodeEnum.ProvideValues,
//                 message: 'Id cannot be empty'
//             };
//         }

//         const posts = await PostService.getUserPosts(id);
//         res.status(200).json(posts);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

exports.likedPosts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        const liked = await PostService.likedPosts(id);
        res.status(200).json(liked);
    } catch (err) {
        res.status(500).json(err);
    }
};
