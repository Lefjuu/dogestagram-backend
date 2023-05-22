// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-require
const validator = require('validator');
const AuthService = require('../services/auth.service.js');
const { session } = require('../../utils/auth.util.js');
const CodeEnum = require('../../utils/statusCodes.js');

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || validator.isEmpty(login)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The login cannot be empty'
            };
        }

        if (!password || validator.isEmpty(password)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The password cannot be empty'
            };
        }

        const user = await AuthService.login(login, password);
        if (user) {
            const { _id, permissions } = user;
            const token = await session(_id, { permissions });
            return res.status(200).json({ user, token });
        }
        return res.sendStatus(401);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         login:
 *           type: string
 *           description: User's username or email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user by checking their Credentials and return a JSON web token for accessing protected routes.
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successfully logged in a user and returned a JSON web token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserToken'
 *       500:
 *         description: Server error occurred
 */

exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || validator.isEmpty(email)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The email cannot be empty'
            };
        }

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The username cannot be empty'
            };
        }

        if (!password || validator.isEmpty(password)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The password cannot be empty'
            };
        }

        const data = await AuthService.register(email, username, password);
        const created = '_id' in data || 'n' in data;
        return res.status(201).json(created);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration
 * components:
 *   schemas:
 *     loginCredentials:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: User's unique username
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 * /auth/register:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginCredentials'
 *     responses:
 *       201:
 *         description: User account created
 *       500:
 *         description: Server error occurred while processing the request
 */

exports.me = async (req, res) => {
    try {
        const userId = req.user.id;

        if (validator.isEmpty(userId)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The User id cannot be empty'
            };
        }

        if (!validator.isMongoId(userId)) {
            throw {
                code: CodeEnum.UserNotExist,
                message: 'Invalid auth User id'
            };
        }

        if (userId) {
            const data = await AuthService.me(userId);
            return data ? res.status(200).json(data) : res.sendStatus(401);
        }
        return res.status(401).json(res);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user data
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized access
 *       '500':
 *         description: Internal server error
 */

exports.sendEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || validator.isEmpty(email)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Email cannot be empty'
            };
        }
        await AuthService.sendEmail(email);
        res.status(200).send('email sended');
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Send an email to reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "email sended"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The error code
 *                 message:
 *                   type: string
 *                   description: The error message
 */

exports.setNewPassword = async (req, res) => {
    try {
        const { password, repeatedPassword } = req.body;
        const { string } = req.params;

        if (
            !password ||
            validator.isEmpty(password) ||
            !repeatedPassword ||
            validator.isEmpty(repeatedPassword)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Provide passwords'
            };
        }
        if (password !== repeatedPassword) {
            throw {
                code: CodeEnum.PasswordsNotIdentical,
                message: 'Passwords are not this same'
            };
        }
        await AuthService.setNewPassword(string, password);
        res.sendStatus(202);
    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * @swagger
 * /auth/newPassword/:string:
 *   patch:
 *     summary: Set a new password for the user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: string
 *         schema:
 *           type: string
 *         required: true
 *         description: String to identify the user who is changing the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The user's new password
 *               repeatedPassword:
 *                 type: string
 *                 description: The user's new password repeated
 *             required:
 *               - password
 *               - repeatedPassword
 *     responses:
 *       '202':
 *         description: The password was changed successfully
 *       '500':
 *         description: Internal server error
 */
