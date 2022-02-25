const login = require('../controllers/auth/login.controller');
const register = require('../controllers/auth/register.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = app => {
    var router = require('express').Router();

    router.get('/login', authMiddleware.isAuth, login.showLoginForm)
    .post('/login', login.login)

    .get('/register', authMiddleware.isAuth, register.create)
    .post('/register', register.register)

    .get('/logout', authMiddleware.loggedin, login.logout)

    app.use(router);
}