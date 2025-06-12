const express = require('express');
const blogController = require('../controllers/blogController');
const { ensureAuthenticated } = require('../controllers/auth');

const router = express.Router();

// Routes for blog operations
router.get('/', blogController.getMainPage); // Redirect to dashboard
router.get('/dashboard', ensureAuthenticated, blogController.getDashboard);
// New post page
router.get('/newpost', ensureAuthenticated, blogController.getNewPostPage);
router.post('/createPost', ensureAuthenticated, blogController.createBlog);
router.get('/posts/:id', blogController.getBlogById);
// Protect delete post
router.post('/posts/:id/delete', ensureAuthenticated, blogController.deleteBlog);
router.get('/posts/:id/edit', ensureAuthenticated, blogController.editPostForm);
router.post('/posts/:id/edit', ensureAuthenticated, blogController.editPost);
router.get('/login', blogController.getLoginPage);
router.post('/login', blogController.login); // Add login route
router.get('/logout', blogController.logout);

module.exports = router;