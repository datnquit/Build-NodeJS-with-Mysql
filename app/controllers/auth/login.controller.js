const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

exports.showLoginForm = (req, res) => {
    res.render('auth/login');
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    if (email && password) {
        User.findByEmail(email, (err, user) => {
            if (!user) {
                res.redirect('/login');
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result == true) {
                        req.session.loggedin = true;
                        req.session.user = user;
                        res.redirect('/home');
                    } else {
                        // A user with that email address does not exists
                        const conflictError = 'User credentials are not valid.';
                        res.render('auth/login', { email, password, conflictError });
                    }
                })
            }
        })
    } else {
        // A user with that email address does not exists
        const conflictError = 'User credentials are not valid.';
        res.render('auth/login', { email, password, conflictError });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.redirect('/500');
        res.redirect('/');
    })
}