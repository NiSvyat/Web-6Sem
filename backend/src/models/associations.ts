interface DbModels {
  [key: string]: any;
  User: any;
  Event: any;
  RefreshToken: any;
}

export default function(db: DbModels): void {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.User.hasMany(db.Event, {
    foreignKey: 'createdBy',
    sourceKey: 'id',
  });

  db.Event.belongsTo(db.User, {
    foreignKey: 'createdBy',
    targetKey: 'id',
  });

  db.User.hasMany(db.RefreshToken, {
    foreignKey: 'userId',
    sourceKey: 'id'
  });

  db.RefreshToken.belongsTo(db.User, {
    foreignKey: 'userId',
    targetKey: 'id'
  });
}