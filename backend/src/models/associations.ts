module.exports = function(db) {
  // Clear any existing associations first
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  // User-Event relationships
  db.User.hasMany(db.Event, {
    foreignKey: 'createdBy',
    sourceKey: 'id',
  });

  db.Event.belongsTo(db.User, {
    foreignKey: 'createdBy',
    targetKey: 'id',
  });

  // User-RefreshToken relationships
  db.User.hasMany(db.RefreshToken, {
    foreignKey: 'id',
    sourceKey: 'id'  // Changed from 'refreshTokens' to 'userRefreshTokens'
  });

  db.RefreshToken.belongsTo(db.User, {
    foreignKey: 'id',
    sourceKey: 'id'  // Changed from 'user' to 'tokenUser'
  });
};