const bcrypt = require('bcrypt');
const User = require('../models/User');

const loginService = {
    authenticate: async (username, password) => {
        const user = await User.findOne({ where: { username } });
        if (!user) return null;
        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;
        return user;
    }
};

module.exports = loginService;
