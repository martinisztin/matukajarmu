const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Update this path to your sequelize instance

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a username' },
            len: { args: [1, 50], msg: 'Name cannot be more than 50 characters' }
        },
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide an email' },
            isEmail: { msg: 'Please provide a valid email' }
        },
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a password' },
            len: { args: [6], msg: 'Password must be at least 6 characters' }
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Hash password before saving
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;