const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Video = sequelize.define('Video', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    // Indexing for search performance [cite: 23]
  },
  description: {
    type: DataTypes.TEXT,
  },
  videoUrl: {
    type: DataTypes.STRING, // Path to .m3u8 manifest [cite: 37]
    allowNull: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING
  }
});

module.exports = Video;