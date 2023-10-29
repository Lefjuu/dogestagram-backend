// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const CodeEnum = require('../../utils/statusCodes.util.js');
const CommentService = require('../services/comment.service.js');

exports.createComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, description } = req.body;

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Username cannot be empty'
            };
        }

        if (!description || validator.isEmpty(description)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Description cannot be empty'
            };
        }

        await CommentService.createComment(id, username, description);

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || validator.isEmpty(id)) {
            // eslint-disable-next-line no-throw-literal
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post id in params cannot be empty'
            };
        }

        const post = await CommentService.getComments(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.sendStatus(500);
    }
};
