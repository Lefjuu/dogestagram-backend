import AuthController from '../controllers/auth.controller.js'
import { mw } from '../../services/mw.service.js'

export default (app) => {
    app.post('/api/auth/login', AuthController.login)
    app.post('/api/auth/register', AuthController.register)
    app.post('/api/auth/forgotPassword', AuthController.sendEmail)
    app.patch('/api/auth/newPassword/:string', AuthController.setNewPassword)
    app.get('/api/auth/me', mw(['user']), AuthController.me)
}
