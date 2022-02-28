const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv/config');
const mailer = require('../../utils/mailer');

exports.create = (req, res) => {
    res.render('auth/register');
}

exports.register = (req, res) => {
    const { email, password, name } = req.body;

    if (email && password && name) {
        User.findByEmail(email, (err, user) => {
            if (err || user) {
                // A user with that email address does not exists
                const conflictError = 'User credentials are exist.';
                res.render('auth/register', { email, password, name, conflictError });
            }
        })

        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashed) => {
            // Create a User
            const user = new User({
                name: name,
                email: email,
                password: hashed
            });
            User.create(user, (err, user) => {
                if (!err) {
                    bcrypt.hash(user.email, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
                        console.log(`${process.env.APP_URL}/verify?email=${user.email}&token=${hashedEmail}`);
                        mailer.sendMail(user.email, "Verify Email", `<a href="${process.env.APP_URL}/verify?email=${user.email}&token=${hashedEmail}"> Verify </a>`)
                    });
                    
                    res.redirect('/login');
                }
            })
        });
    } else {
        const conflictError = 'User credentials are exist.';
        res.render('auth/register', { email, password, name, conflictError });
    }
}

exports.verify = (req, res) => {
    bcrypt.compare(req.query.email, req.query.token, (err, result) => {
        if (result == true) {
            User.verify(req.query.email, (err, result) => {
                if (!err) {
                    res.redirect('/login');
                } else {
                    res.redirect('/500');
                }
            });
        } else {
            res.redirect('/404');
        }
    })
}
