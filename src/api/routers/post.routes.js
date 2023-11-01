const { mw } = require('../../services/mw.service.js');
const { postController } = require('../controllers/index.js');

module.exports = app => {
    app.get('/api/posts/user', mw(['user']), postController.getUserPosts);
    app.get('/api/posts/:id', mw(['user']), postController.getPost);
    app.post('/api/posts', mw(['user']), postController.createPost);
    // app.get('/api/posts/user/:id', mw(['user']), PostController.getUserPosts);
    // app.delete('/api/posts/:id', mw(['user']), PostController.deletePost);
    // app.patch('/api/posts/:id', mw(['user']), PostController.updatePost);
    // app.post('/api/posts/like/:id', mw(['user']), PostController.likePost);
    // app.patch('/api/posts/unlike/:id', mw(['user']), PostController.unlikePost);
    // app.get(
    //     '/api/posts/timeline/:id',
    //     mw(['user']),
    //     PostController.getTimelineUser
    // );
    // app.get(
    //     '/api/posts/explore/:id',
    //     mw(['user']),
    //     PostController.getExploreUser
    // );
    // app.get('/api/posts/:id/liked', mw(['user']), PostController.likedPosts);
};
