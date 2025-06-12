const Blog = require('../models/Blog');

const blogService = {
    async getAllBlogs() {
        return await Blog.findAll({ order: [['createdAt', 'DESC']] });
    },
    async getBlogById(id) {
        return await Blog.findByPk(id);
    },
    async createBlog(data) {
        return await Blog.create(data);
    },
    async updateBlog(id, data) {
        return await Blog.update(data, { where: { id } });
    },
    async deleteBlog(id) {
        return await Blog.destroy({ where: { id } });
    },
    getStats(blogs) {
        const totalPosts = blogs.length;
        const publishedPosts = blogs.filter(b => b.status === 'published' || !b.status).length;
        return { totalPosts, publishedPosts };
    },
    updatePost: async (id, data) => {
        const post = await Blog.findByPk(id);
        if (!post) throw new Error('Bejegyzés nem található');
        post.title = data.title;
        post.author = data.author;
        post.content = data.content;
        post.tags = data.tags;
        await post.save();
        return post;
    },
};

module.exports = blogService;
