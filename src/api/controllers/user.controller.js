/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const UserService = require('../services/user.service.js');
const CodeEnum = require('../../utils/statusCodes.js');

exports.getUser = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The username cannot be empty'
            };
        }

        const user = await UserService.getUser(username);
        if (user) {
            const {
                lastLogin,
                date,
                email,
                roles,
                status,
                permissions,
                liked,
                ...thisUser
            } = user;
            return res.status(200).json({ ...thisUser });
        }
        return res.sendStatus(401);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 *   tags:
 *     name: Post
 *     description: Post actions
 * /user/:username:
 *   get:
 *     summary: Get a user by username
 *     security:
 *     - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user to retrieve
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/publicUser'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

exports.followUser = async (req, res) => {
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
                message: 'Both of id cannot be empty'
            };
        }
        await UserService.followUser(id, userId);
        return res.sendStatus(202);
    } catch (err) {
        res.status(500).json(err);
    }
};
/**
 * @swagger
 * /user/follow/:id:
 *  post:
 *    summary: Follow a user by ID
 *    security:
 *    - bearerAuth: []
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The ID of the user who is following
 *      - in: body
 *        name: userId
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: string
 *        description: The ID of the user to be followed
 *    responses:
 *      202:
 *        description: Accepted
 *      500:
 *        description: Internal Server Error
 */

exports.unfollowUser = async (req, res) => {
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
                message: 'Both of id cannot be empty'
            };
        }
        await UserService.unfollowUser(id, userId);
        return res.sendStatus(202);
    } catch (err) {
        res.status(500).json(err);
    }
};
/**
 * @swagger
 * /user/unfollow/:id:
 *    post:
 *      summary: Unfollow a user by ID
 *      security:
 *      - bearerAuth: []
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the user who is unfollowing
 *        - in: body
 *          name: userId
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *          description: The ID of the user to be unfollowed
 *      responses:
 *        202:
 *          description: Accepted
 *        500:
 *          description: Internal Server Error
 */

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            };
        }

        const updatedData = await UserService.updateUser(id, body);
        res.status(200).json(updatedData);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * /user/update/:id:
 *   patch:
 *     summary: Update a user's data
 *     security:
 *     - bearerAuth: []
 *     tags: [User]
 *     description: Update a user's data with the given ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Updated user object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             username:
 *               type: integer
 *             biography:
 *               type: string
 *             img:
 *               type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

exports.getUserFollowers = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Username cannot be empty'
            };
        }

        const usersArray = await UserService.getUserFollowers(username);
        res.status(200).json(usersArray);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * /user/:username/followers:
 *   get:
 *     summary: Get followers of user by username
 *     security:
 *     - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of user to get followers for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of user objects that follow the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/publicUser'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

exports.getUserFollowings = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Username cannot be empty'
            };
        }

        const usersArray = await UserService.getUserFollowings(username);
        res.status(200).json(usersArray);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * /user/:username/followings:
 *   get:
 *     summary: Get the list of users that a user is following
 *     security:
 *     - bearerAuth: []
 *     tags: [User]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user whose followings are to be fetched
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/publicUser'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
