const User = require('../models/user');
const { validateConfirmPassword } = require('../validator')
const bcrypt = require('bcryptjs');
const passport = require("passport");
const jwt = require("jsonwebtoken");

const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require("express-validator");

// Handle Author create on POST.
exports.user_create_post = [

    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 3, max: 16 }).escape().withMessage('Username must contain between 3 and 6 characters..'),
    [validateConfirmPassword],

    // Process request after validation and sanitization.
    (req, res, next) => {

        console.log(req.body.password);
        console.log(req.body.username);

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.

            res.json({ errors: errors.array() });
            return;
        } else {
            // Data from form is valid.

            // Encrypt password with bcrypt.
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    // Error in hashing password. Rerender with data and error.
                    res.json({ errors: errors.array() });
                } else {
                    // Create Author object with escaped/trimmed/encrypted data.

                    // List of profile pics in custom dingbat font.
                    const picChoices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o']

                    var user = new User(
                        {
                            username: req.body.username,
                            password: hashedPassword,
                            pic: picChoices[Math.floor(Math.random() * picChoices.length)],
                            admin: false,
                            likes: 0
                        }
                    );

                    // Save user.
                    user.save(function (err) {
                        if (err) { return next(err); }
                        res.json(true);
                    });
                }
            });
        }
    }
];

// Handle signing user in on POST.
exports.user_signin_post = (req, response, next) => {
    

    let { username, password } = req.body;

    console.log('signing in...' + username);

    // Search mongoDB for user.
    User.findOne({username: username}, (err, results ) => {
        if (err) return next(err);

        if (results === null) {
            return response.status(401).json({ message: "User not found" })
        }

        bcrypt.compare(password, results.password, (err, res) => {
            if (res) {
                // Password is correct.
                const opts = {}
                opts.expiresIn = 120;  //token expires in 2min
                const secret = process.env.SECRET_KEY
                const token = jwt.sign({ username }, secret, opts);
                return response.status(200).json({
                    message: "User signed in succesfully",
                    token,
                    user: results
                })
            }

            return response.status(401).json({ message: "Auth Failed" })
        })        
    })
}

// Handle signing user out.
exports.user_signout_post = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

