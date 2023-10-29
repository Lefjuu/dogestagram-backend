const authRouter = require('./auth.routes');
const commentRouter = require('./comment.routes');
const postRouter = require('./post.routes');
const userRouter = require('./user.routes');

module.exports = {
    authRouter,
    commentRouter,
    postRouter,
    userRouter
};
