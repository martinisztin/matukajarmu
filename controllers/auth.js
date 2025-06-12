// auth.js

function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/blog/login');
}

module.exports = {
    ensureAuthenticated
};