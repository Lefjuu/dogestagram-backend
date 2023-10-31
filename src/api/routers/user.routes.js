const { mw } = require('../../services/mw.service.js');
const { userController } = require('../controllers/index.js');

module.exports = app => {
    app.get(
        '/api/users/check-username-available/:username',
        userController.checkUsernameAvailable
    );
    app.get('/api/users/:id', mw(['user']), userController.getUser);
    app.patch('/api/users', mw(['user']), userController.updateUser);
    app.get(
        '/api/users/followers/:id',
        mw(['user']),
        userController.getUserFollowers
    );

    app.get(
        '/api/users/followings/:id',
        mw(['user']),
        userController.getUserFollowings
    );

    app.patch(
        '/api/users/change-password',
        mw(['user']),
        userController.changePassword
    );
    app.post('/api/users/follow', mw(['user']), userController.followUser);
    app.patch('/api/users/unfollow', mw(['user']), userController.unfollowUser);
};
