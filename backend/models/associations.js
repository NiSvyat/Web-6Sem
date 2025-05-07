const { User } = require('./User');
const { Event } = require('./Event');

Event.belongsTo(User, {
  foreignKey: 'createdBy',
  targetKey: 'id',
});

User.hasMany(Event, {
  foreignKey: 'createdBy',
  sourceKey: 'id',
});

module.exports = { associate: () => {} };