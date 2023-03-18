import { mw } from '../../services/mw.service.js'
import CommentController from '../controllers/comment.controller.js'

export default (app) => {
    app.post(
        '/api/comment/add/:id',
        mw(['user']),
        CommentController.createComment
    )
    app.get('/api/comment/get/:id', mw(['user']), CommentController.getComments)
}
