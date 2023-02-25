import CommentController from '../controllers/comment.controller.js'

export default (app) => {
    app.post('/api/comment/add/:id', CommentController.createComment)
    app.get('/api/comment/get/:id', CommentController.getComments)
}