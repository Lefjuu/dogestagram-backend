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

export const getPost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await PostService.getPost(id)
        res.status(200).json(post)
    } catch (err) {
        res.sendStatus(500)
    }
}

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

const deletePost = async (req, res) => {
    try {
        const { id } = req.params

        await PostService.deletePost(id)
        res.sendStatus(204)
    } catch (err) {
        res.status(500).json(err)
    }
}

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
                message: 'Post Id cannot be empty'
            }
        }
        const post = await PostService.updatePost(id, description)
        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        await PostService.likePost(id, userId)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).json(err)
    }
}

const unlikePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        await PostService.unlikePost(id, userId)
        res.sendStatus(204)
    } catch (err) {
        res.status(500).json(err)
    }
}

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

const getUserPosts = async (req, res) => {
    try {
        const posts = await PostService.getUserPosts(req.params.id)
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

const likedPosts = async (req, res) => {
    try {
        const { id } = req.params

        const liked = await PostService.likedPosts(id)
        res.status(200).json(liked)
    } catch (err) {
        res.status(500).json(err)
    }
}

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
