// Models
import CodeEnum from '../../utils/statusCodes.js'
import UserModel from '../models/user.model.js'
import PostModel from '../models/post.model.js'
import { v4 as uuidv4 } from 'uuid'
import { deleteFile, uploadFile } from '../../lib/aws.lib.js'

const getPosts = async () => {
    let posts = await PostModel.find({})

    for await (let post of posts) {
        const user = await UserModel.findById(post.author).lean()
        post['author'] = user.username
    }

    return posts
}

const getPost = async (id) => {
    let post = await PostModel.findById(id).lean()

    const user = await UserModel.findById(post.author).lean()
    post['author'] = user.username
    post['authorImg'] = user.img
    return post
}

const createPost = async (body) => {
    const file = body.img
    const FileId = uuidv4()
    const result = await uploadFile(file, FileId)

    const newPost = await PostModel.create({
        img: result.Location,
        author: body.author,
        description: body.description,
        likes: ['']
        // comments: ['']
    })
    return newPost
}

const deletePost = async (id) => {
    const post = await PostModel.findOne({
        _id: id
    }).lean()
    if (post === null) {
        throw {
            code: CodeEnum.PostNotExist,
            message: `post not exist`
        }
    }
    await PostModel.findOneAndDelete({
        _id: id
    }).lean()

    deleteFile(post.img)
    return
}

const updatePost = async (id, description) => {
    const post = await PostModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            description: description
        }
    )

    if (post === null) {
        throw {
            code: CodeEnum.PostNotExist,
            message: `Post not exist`
        }
    }

    return post
}

const likePost = async (id, userId) => {
    await PostModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $push: {
                likes: userId
            }
        }
    ).then((res) => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `Post not exist`
            }
        }
    })

    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $push: {
                liked: id
            }
        }
    ).then((res) => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `User not exist`
            }
        }
    })
    return
}

const unlikePost = async (id, userId) => {
    await PostModel.findByIdAndUpdate(
        {
            _id: id
        },
        {
            $pull: {
                likes: userId
            }
        }
    ).then((res) => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `User not exist`
            }
        }
    })
    await UserModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $pull: {
                liked: id
            }
        }
    ).then((res) => {
        if (res === null) {
            throw {
                code: CodeEnum.PostNotExist,
                message: `User not exist`
            }
        }
    })
    return
}

const getTimelineUser = async (id) => {
    const user = await UserModel.findById({ _id: id })
    if (user.followings === null) {
        return null
    }
    await user.followings.pull(user._id)
    let posts = await PostModel.find({
        author: {
            $in: user.followings
        }
    })
        .sort({ createdAt: -1 })
        .lean()
    for await (let post of posts) {
        const user = await UserModel.findById(post.author).lean()
        post['author'] = user.username
    }

    return posts
}

const getExploreUser = async (id) => {
    const user = await UserModel.findById({ _id: id })
    let posts = await PostModel.find({
        author: {
            $nin: user.followings,
            $ne: user._id
        }
    })
        .sort({ createdAt: -1 })
        .lean()
    for await (let post of posts) {
        const user = await UserModel.findById(post.author).lean()
        if (user) {
            post['author'] = user.username
        }
    }
    return posts
}

const getUserPosts = async (id) => {
    let posts = await PostModel.find({
        author: id
    }).lean()

    posts.sort((a, b) => {
        if (!a.createdAt) {
            return 1
        }
        if (!b.createdAt) {
            return -1
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return posts
}

const likedPosts = async (id) => {
    const user = await UserModel.findOne({ _id: id }).lean()

    const array = []
    for (let i = 0; i < user.liked.length; i++) {
        await PostModel.findOne({ _id: user.liked[i] })
            .lean()
            .then((res) => {
                array.push(res)
            })
    }
    return array
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
