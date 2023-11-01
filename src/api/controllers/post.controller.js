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
    console.log(posts);

    if (posts instanceof AppError) {
        return next(posts);
    }

    res.status(200).json({
        status: 'success',
        data: posts
    });
});

exports.getPost = CatchError(async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!validator.isMongoId(id)) {
            return next(
                new AppError('Provide valid id', 400, CodeEnum.ProvideValues)
            );
        }

        const post = await postService.getPost(id);
        res.status(200).json(post);
    } catch (err) {
        res.sendStatus(500);
    }
});

exports.createPost = CatchError(async (req, res, next) => {
    const { img, description } = req.body;

    try {
        if (!img || validator.isEmpty(img)) {
            return next(new AppError('Add Image', 400, CodeEnum.ProvideValues));
        }

        const postBody = { img, description, userId: req.user.id };
        const post = await postService.createPost(postBody);

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        await PostService.deletePost(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post Id cannot be empty'
            };
        }
        if (!description || validator.isEmpty(description)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Description cannot be empty'
            };
        }
        const post = await PostService.updatePost(id, description);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (
            !id ||
            !validator.isMongoId(id) ||
            !userId ||
            !validator.isMongoId(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post Id cannot be empty'
            };
        }
        await PostService.likePost(id, userId);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (
            !id ||
            !validator.isMongoId(id) ||
            !userId ||
            !validator.isMongoId(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post Id cannot be empty'
            };
        }

        await PostService.unlikePost(id, userId);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json(err);
    }
};

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
