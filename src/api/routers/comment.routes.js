const CommentController = require('../controllers/comment.controller.js');
const { mw } = require('../../services/mw.service.js');
const { commentController } = require('../controllers/index.js');
module.exports = app => {
    app.post('/api/comments', mw(['user']), commentController.createComment);
    app.get('/api/comments/:id', mw(['user']), commentController.getComment);
    app.get(
        '/api/comments',
        mw(['user']),
        commentController.getCommentsByPostId
    );
};
