const blogService = require('../services/blogService');
const loginService = require('../services/loginService');

// Controller methods for blog operations
const blogController = {
    getMainPage: async (req, res) => {
        try {
            const blogs = await blogService.getAllBlogs();
            res.render('blog/main', {
                blogs,
                posts: blogs,
                session: req.session
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch blog posts', error: error.message });
        }
    },

    getNewPostPage: (req, res) => {
        res.render('blog/new', { session: req.session });
    },

    getDashboard: async (req, res) => {
        try {
            const blogs = await blogService.getAllBlogs();
            const { totalPosts, publishedPosts } = blogService.getStats(blogs);
            res.render('blog/dashboard', {
                blogs,
                posts: blogs,
                totalPosts,
                publishedPosts,
                session: req.session
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch blog posts', error: error.message });
        }
    },

    // Get a single blog post by ID
    getBlogById: async (req, res) => {
        try {
            const blog = await blogService.getBlogById(req.params.id);
            if (!blog) {
                // Redirect to landing page if post not found
                return res.redirect('/blog');
            }
            res.render('blog/post', { post: blog, session: req.session });
        } catch (error) {
            res.redirect('/blog');
        }
    },

    // Create a new blog post
    createBlog: async (req, res) => {
        try {
            const { title, content, author, tags } = req.body;
            // Convert tags string to array if needed
            const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];
            const newBlog = await blogService.createBlog({ title, content, author, tags: tagsArray });
            // Redirect to dashboard after successful creation
            res.redirect('/blog/dashboard');
        } catch (error) {
            // Optionally, re-render the form with error message and previous input
            res.status(500).render('blog/new', { error: 'Hiba történt a bejegyzés mentésekor.', old: req.body });
        }
    },

    // Update an existing blog post
    updateBlog: async (req, res) => {
        try {
            const { title, content, tags } = req.body;
            const [updated] = await blogService.updateBlog(req.params.id, { title, content, tags, updatedAt: Date.now() });
            if (!updated) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            const updatedBlog = await blogService.getBlogById(req.params.id);
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update blog post', error: error.message });
        }
    },

    // Delete a blog post
    deleteBlog: async (req, res) => {
        try {
            const deleted = await blogService.deleteBlog(req.params.id);
            if (!deleted) {
                return res.status(404).redirect('blog/dashboard'); // TODO: add error message
            }
            return res.status(200).redirect('blog/dashboard'); // TODO: add success message
        } catch (error) {
            res.status(500).redirect('blog/dashboard'); // TODO: add error message
        }
    },

    // GET /blog/posts/:id/edit
    editPostForm: async (req, res) => {
        try {
            const post = await blogService.getBlogById(req.params.id);
            if (!post) {
                return res.status(404).render('error', { message: 'A bejegyzés nem található.' });
            }
            res.render('blog/new', {
                post,
                editMode: true,
                pageTitle: 'Bejegyzés szerkesztése',
                session: req.session
            });
        } catch (err) {
            res.status(500).render('error', { message: 'Hiba történt a bejegyzés betöltésekor.' });
            console.log()
        }
    },

    // POST /blog/posts/:id/edit
    editPost: async (req, res) => {
        try {
            await blogService.updatePost(req.params.id, req.body);
            res.redirect('/blog/dashboard');
        } catch (err) {
            res.status(500).render('error', { message: 'Hiba történt a bejegyzés frissítésekor.' });
        }
    },

    getLoginPage: async (req, res) => {
        if (req.session && req.session.userId) {
            return res.redirect('/blog/dashboard');
        }
        res.render('blog/login', { session: req.session });
    },

    // POST /blog/login
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await loginService.authenticate(username, password);
            if (!user) {
                return res.status(401).render('blog/login', { error: 'Hibás felhasználónév vagy jelszó.' });
            }
            req.session.userId = user.id;
            res.redirect('/blog/dashboard');
        } catch (err) {
            res.status(500).render('blog/login', { error: 'Hiba történt a bejelentkezés során.' });
            console.log(err);
        }
    },

    // GET /blog/logout
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/blog/login');
        });
    },
};

module.exports = blogController;