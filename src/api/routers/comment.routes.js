const CommentController = require('../controllers/comment.controller.js');
const { mw } = require('../../services/mw.service.js');

module.exports = app => {
    app.post(
        '/api/comment/add/:id',
        mw(['user']),
        CommentController.createComment
    );
    app.get(
        '/api/comment/get/:id',
        mw(['user']),
        CommentController.getComments
    );
};
