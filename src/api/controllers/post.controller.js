import PostService from '../services/post.service.js'
import validator from 'validator'
import CodeEnum from '../../utils/statusCodes.js'

const getPosts = async (req, res) => {
    try {
        const posts = await PostService.getPosts()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 *   tags:
 *     name: Post
 *     description: Post actions
 * /post:
 *   get:
 *     summary: Returns a list of posts
 *     security:
 *       - bearerAuth: []
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

export const getPost = async (req, res) => {
    try {
        const { id } = req.params
        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            }
        }

        const post = await PostService.getPost(id)
        res.status(200).json(post)
    } catch (err) {
        res.sendStatus(500)
    }
}

/**
 * @swagger
 * /post/:id:
 *   get:
 *     summary: Returns a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: The post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

const createPost = async (req, res) => {
    const { author, img, description } = req.body

    try {
        if (!author || validator.isEmpty(author)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The author cannot be empty'
            }
        }

        if (!img || validator.isEmpty(img)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The image must be provided'
            }
        }
        if (!description || validator.isEmpty(description)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'The description cannot be empty'
            }
        }
        const post = await PostService.createPost(req.body)

        res.status(201).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Creates a new post
 *     security:
 *       - bearerAuth: []
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: The author of the post
 *               img:
 *                 type: string
 *                 description: The image URL of the post
 *               description:
 *                 type: string
 *                 description: The description of the post
 *             example:
 *               author: John Doe
 *               img: data:image base/64
 *               description: Lorem ipsum dolor sit amet
 *     responses:
 *       201:
 *         description: The created post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

const deletePost = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            }
        }

        await PostService.deletePost(id)
        res.sendStatus(204)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 * /post/:id:
 *   delete:
 *     summary: Deletes a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the post to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post Id cannot be empty'
            }
        }
        if (!description || validator.isEmpty(description)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Description cannot be empty'
            }
        }
        const post = await PostService.updatePost(id, description)
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

/**
 * @swagger
 * /post/:id:
 *   patch:
 *     summary: Updates a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the post to update
 *       - in: body
 *         name: post
 *         description: The updated post object
 *         schema:
 *           type: object
 *           properties:
 *             description:
 *               type: string
 *               description: The new description for the post
 *               example: This is a new description for the post.
 *         required: true
 *     responses:
 *       200:
 *         description: The updated post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (
            !id ||
            !validator.isMongoId(id) ||
            !userId ||
            !validator.isMongoId(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post Id cannot be empty'
            }
        }
        await PostService.likePost(id, userId)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 *   /post/like/:id:
 *     post:
 *       summary: Like a post
 *       security:
 *       - bearerAuth: []
 *       tags: [Post]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of the post to like
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *         - name: body
 *           in: body
 *           description: User ID to associate with the like
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *       responses:
 *         '201':
 *           description: Post liked successfully
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 *
 */

const unlikePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        if (
            !id ||
            !validator.isMongoId(id) ||
            !userId ||
            !validator.isMongoId(userId)
        ) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post Id cannot be empty'
            }
        }

        await PostService.unlikePost(id, userId)
        res.sendStatus(204)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 *   /post/unlike/:id:
 *     post:
 *       summary: Remove user's like from a post
 *       security:
 *       - bearerAuth: []
 *       tags: [Post]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of the post to remove user's like from
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *         - name: body
 *           in: body
 *           description: User ID to remove from the post's likes
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *       responses:
 *         '204':
 *           description: User's like removed from the post successfully
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */

const getTimelineUser = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            }
        }
        const timeline = await PostService.getTimelineUser(id)
        res.status(200).json(timeline)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

/**
 * @swagger
 *   /post/timeline/:id:
 *     get:
 *       summary: Get a user's timeline
 *       security:
 *       - bearerAuth: []
 *       tags: [Post]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of the user whose timeline to retrieve
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         '200':
 *           description: User timeline retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */

const getExploreUser = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'User id cannot be empty'
            }
        }
        const posts = await PostService.getExploreUser(id)
        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

/**
 * @swagger
 *   /post/explore/:id:
 *     get:
 *       summary: Get posts for a user to explore
 *       security:
 *       - bearerAuth: []
 *       tags: [Post]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of the user whose posts to explore
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         '200':
 *           description: Posts retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */

const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            }
        }

        const posts = await PostService.getUserPosts(id)
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 *   /post/user/:id:
 *     get:
 *       summary: Get posts by user ID
 *       security:
 *       - bearerAuth: []
 *       tags: [Post]
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of the user whose posts to retrieve
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       responses:
 *         '200':
 *           description: Posts retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */

const likedPosts = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || !validator.isMongoId(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            }
        }

        const liked = await PostService.likedPosts(id)
        res.status(200).json(liked)
    } catch (err) {
        res.status(500).json(err)
    }
}

/**
 * @swagger
 * /post/:id/liked:
 *   get:
 *     summary: Get liked posts by user ID
 *     security:
 *     - bearerAuth: []
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */

export default {
    getPosts,
    getPost,
    createPost,
    deletePost,
    updatePost,
    likePost,
    unlikePost,
    getTimelineUser,
    getExploreUser,
    getUserPosts,
    likedPosts
}
