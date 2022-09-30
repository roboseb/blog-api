var express = require('express');
const { new_comment_post, comments_get, comment_like_post } = require('../controllers/commentController');
const { new_post_post, posts_get, post_like_post } = require('../controllers/postController');
const { user_create_post, user_signin_post } = require('../controllers/userController');
var router = express.Router();

/* GET default response. */
router.get("/", (req, res, next) => {
    res.send("roboseb's Blog API");
});

/* GET API. */
router.get("/api", (req, res, next) => {
    res.send('Instructions on how to use the BLOG api');
});

// Post request for creating new user.
router.post('/api/sign-up', user_create_post);

// POST request for signing in a user.
router.post('/api/sign-in', user_signin_post);

// GET request for retrieving all comments.
router.get('/api/comments', comments_get);

// POST request for adding a new comment 
router.post('/api/comments/new', new_comment_post);

// POST request for adding a new post/article.
router.post('/api/posts/new', new_post_post);

// GET request for retrieving all posts/articles.
router.get('/api/posts', posts_get);

// POST request for liking a comment.
router.post('/api/comments/like', comment_like_post);

// POST request for liking a post.
router.post('/api/posts/like', post_like_post);


module.exports = router;
