const UserController = require('../controllers/user.controller.js');
const { mw } = require('../../services/mw.service.js');

module.exports = app => {
    app.get('/api/user/:username', mw(['user']), UserController.getUser);
    app.post('/api/user/follow/:id', mw(['user']), UserController.followUser);
    app.patch(
        '/api/user/unfollow/:id',
        mw(['user']),
        UserController.unfollowUser
    );
    app.patch('/api/user/update/:id', mw(['user']), UserController.updateUser);
    app.get(
        '/api/user/:username/followers',
        mw(['user']),
        UserController.getUserFollowers
    );
    app.get(
        '/api/user/:username/followings',
        mw(['user']),
        UserController.getUserFollowings
    );
};
