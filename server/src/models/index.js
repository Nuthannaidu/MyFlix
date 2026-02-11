const User = require('./User');
const Video = require('./Video');
const Tag = require('./Tag');

Video.belongsToMany(Tag, {
  through: 'VideoTags',
  foreignKey: 'VideoId',
});

Tag.belongsToMany(Video, {
  through: 'VideoTags',
  foreignKey: 'TagId',
});

module.exports = {
  User,
  Video,
  Tag,
};
