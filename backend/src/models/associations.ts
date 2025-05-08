import { Sequelize } from 'sequelize';

interface DbModels {
  [key: string]: any;
  User: any;
  Event: any;
  RefreshToken: any;
}

export default function(db: DbModels): void {
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
    foreignKey: 'userId',  // Changed to 'userId' for proper foreign key relationship
    sourceKey: 'id'
  });

  db.RefreshToken.belongsTo(db.User, {
    foreignKey: 'userId',  // Changed to 'userId' for proper foreign key relationship
    targetKey: 'id'
  });
}