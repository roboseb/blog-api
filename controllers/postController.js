const mongoose = require('mongoose');
const async = require('async');
const { body, validationResult } = require("express-validator");

const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

// POST request for adding a new message.
exports.new_post_post = [
    // Validate and sanitize message.
    body('content').trim(),
    body('title').trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log('adding new post...')
        console.log(req.body.username)

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        User.findOne({ username: req.body.username }, (err, result) => {
            if (err) { return next(err); }
            console.log(result);

            // Create post object.
            var post = new Post (
                {
                    user: result,
                    username: result.username,
                    pic: result.pic,
                    likes: 0,
                    postDate: new Date(),
                    title: req.body.title,
                    content: req.body.content,
                    comments: []
                }
            );

            if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/errors messages.

                res.json({ errors: errors.array() });
                return;
            } else {
                // Data from form is valid.

                // Save user.
                post.save(function (err) {
                    if (err) { return next(err); }
                    res.json('Post saved.')
                });
            }
        });
    }
];

// GET request for all posts/articles.
exports.posts_get = (req, res, next) => {
    async.parallel({
        post_list(callback) {
            Post.find({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    },
        (err, results) => {
            console.log('fetching post data...')

            if (err) return next(err);
            res.json({post_list: results.post_list});
        });
};

// POST request for liking a post.
exports.post_like_post = (req, res, next) => {

    Post.findOneAndUpdate({_id: req.body.id}, {$inc : {likes : 1}}, (err, response) => {
        console.log('liking post...')

        if (err) return next(err);
        res.json('Post liked succesfully');
    });
};
