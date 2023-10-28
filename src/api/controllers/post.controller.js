// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const PostService = require('../services/post.service.js');
const CodeEnum = require('../../utils/statusCodes.js');

exports.getPosts = async (req, res) => {
    try {
        const posts = await PostService.getPosts();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        const post = await PostService.getPost(id);
        res.status(200).json(post);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.createPost = async (req, res) => {
    const { author, img, description } = req.body;

    try {
        if (!author || validator.isEmpty(author)) {
            throw new Error({
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            });
        }

        if (!img || validator.isEmpty(img)) {
            throw new Error({
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            });
        }
        if (!description || validator.isEmpty(description)) {
            throw new Error({
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            });
        }
        const post = await PostService.createPost(req.body);

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};

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

exports.getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        const posts = await PostService.getUserPosts(id);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

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
