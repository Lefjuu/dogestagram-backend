const AuthController = require('../controllers/auth.controller.js');
const { mw } = require('../../services/mw.service.js');

module.exports = app => {
    app.post('/api/auth/login', AuthController.login);
    app.post('/api/auth/register', AuthController.register);
    app.post('/api/auth/forgotPassword', AuthController.sendEmail);
    app.patch('/api/auth/newPassword/:string', AuthController.setNewPassword);
    app.get('/api/auth/me', mw(['user']), AuthController.me);
};
