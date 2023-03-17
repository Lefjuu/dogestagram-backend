import AuthController from '../controllers/auth.controller.js'
import { mw } from '../../services/mw.service.js'

export default (app) => {
    app.post('/api/auth/login', AuthController.login)
    app.post('/api/auth/register', AuthController.register)
    app.post('/api/auth/forgot-password', AuthController.sendEmail)
    app.post('/api/auth/recover', AuthController.recover)
    app.patch('/api/auth/new-password/:string', AuthController.setNewPassword)
    app.get('/api/auth/me', mw(['user']), AuthController.me)
}
