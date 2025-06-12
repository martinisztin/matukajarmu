const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING, // Comma-separated tags
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? rawValue.split(',') : [];
    },
    set(val) {
      this.setDataValue('tags', Array.isArray(val) ? val.join(',') : val);
    },
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
}, {
  tableName: 'blog', // specify the table name
});

module.exports = Blog;
