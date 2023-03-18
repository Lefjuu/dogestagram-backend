import PostController from '../controllers/post.controller.js'
import { mw } from '../../services/mw.service.js'

export default (app) => {
    app.get('/api/post', mw(['user']), PostController.getPosts)
    app.get('/api/post/:id', mw(['user']), PostController.getPost)
    app.post('/api/post', mw(['user']), PostController.createPost)
    app.get('/api/post/user/:id', mw(['user']), PostController.getUserPosts)
    app.delete('/api/post/:id', mw(['user']), PostController.deletePost)
    app.patch('/api/post/:id', mw(['user']), PostController.updatePost)
    app.post('/api/post/like/:id', mw(['user']), PostController.likePost)
    app.patch('/api/post/unlike/:id', mw(['user']), PostController.unlikePost)
    app.get(
        '/api/post/timeline/:id',
        mw(['user']),
        PostController.getTimelineUser
    )
    app.get(
        '/api/post/explore/:id',
        mw(['user']),
        PostController.getExploreUser
    )
    app.get('/api/post/:id/liked', mw(['user']), PostController.likedPosts)
}
