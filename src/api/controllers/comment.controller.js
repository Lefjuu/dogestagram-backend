import validator from 'validator'
import CodeEnum from '../../utils/statusCodes.js'
import CommentService from '../services/comment.service.js'

const createComment = async (req, res) => {
    try {
        const { id } = req.params
        const { username, description } = req.body

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Id cannot be empty'
            }
        }

        if (!username || validator.isEmpty(username)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Username cannot be empty'
            }
        }

        if (!description || validator.isEmpty(description)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Description cannot be empty'
            }
        }

        await CommentService.createComment(id, username, description)

        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export const getComments = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || validator.isEmpty(id)) {
            throw {
                code: CodeEnum.ProvideValues,
                message: 'Post id in params cannot be empty'
            }
        }

        const post = await CommentService.getComments(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.sendStatus(500)
    }
}

export default {
    createComment,
    getComments
}
