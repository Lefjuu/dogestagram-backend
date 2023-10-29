const { mw } = require('../../services/mw.service.js');
const { userController } = require('../controllers/index.js');

module.exports = app => {
    app.get(
        '/api/users/check-username-available/:username',
        userController.checkUsernameAvailable
    );
    app.get('/api/users/:id', mw(['user']), userController.getUser);
    app.patch('/api/users', mw(['user']), userController.updateUser);

    // app.patch(
    //     '/api/users/new-password',
    //     mw(['user']),
    //     UserController.newPassword
    // );
    // app.post('/api/user/follow/:id', mw(['user']), userController.followUser);
    // app.patch(
    //     '/api/users/unfollow/:id',
    //     mw(['user']),
    //     UserController.unfollowUser
    // );
    // app.get(
    //     '/api/users/:username/followers',
    //     mw(['user']),
    //     UserController.getUserFollowers
    // );
    // app.get(
    //     '/api/users/:username/followings',
    //     mw(['user']),
    //     UserController.getUserFollowings
    // );
};
