// Models
import { hash } from '../../utils/auth.util.js'
import CommentModel from '../models/comment.model.js'
import PostModel from '../models/post.model.js'

const getComments = async (id) => {
    const post = await PostModel.findById(id).populate('comments').lean()

    let comment = await CommentModel.find({ post: post._id }).lean()

    return [comment]
}

const createComment = async (id, username, description) => {
    const uniqueString = hash(12)
    const comment = new CommentModel({
        _id: uniqueString,
        post: id,
        author: username,
        description: description
    })

    await comment.save()
    const postById = await PostModel.findById(id)
    postById.comments.push(comment._id)
    await postById.save()
    return
}

export default {
    getComments,
    createComment
}
