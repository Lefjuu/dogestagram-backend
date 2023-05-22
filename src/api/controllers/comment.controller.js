// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const CodeEnum = require('../../utils/statusCodes.js');
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

/**
 * @swagger
 *   tags:
 *     name: Comment
 *     description: Comment actions
 * comment/add/:id:
 *   post:
 *     summary: Create a new comment for a post
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     description: Use this endpoint to create a new comment for a post by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to add a comment to
 *         required: true
 *         schema:
 *           type: string
 *       - name: username
 *         in: body
 *         description: Username of the comment author
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *       - name: description
 *         in: body
 *         description: Description of the comment
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /comment/get/:id:
 *   get:
 *     summary: Retrieve comments for a post
 *     security:
 *       - bearerAuth: []
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve comments for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Bad request, the ID parameter is missing or invalid
 *       '500':
 *         description: Internal server error
 */
