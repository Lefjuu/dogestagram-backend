const { mw } = require('../../services/mw.service.js');
const { authController } = require('../controllers/index.js');

module.exports = app => {
    app.post('/api/auth/login', authController.login);
    app.post('/api/auth/register', authController.register);
    //TODO: app.get('/verify-email', AuthController.sendVerifyEmail);
    app.post('/api/auth/verify/:token', authController.verify);
    app.post('/api/auth/forgot-password', authController.forgotPassword);
    app.patch('/api/auth/new-password/:string', authController.setNewPassword);
    app.get('/api/auth/me', mw(['user']), authController.me);
};
