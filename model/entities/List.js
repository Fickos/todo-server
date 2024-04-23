const { Sequelize, DataTypes } = require('sequelize');

class List extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        ID: {
          type: DataTypes.STRING,
          field: 'ID',
          primaryKey: true,
        },
        CreatedAt: {
          type: DataTypes.DATE,
          field: 'CreatedAt',
          defaultValue: Sequelize.NOW
        }
      },
      {
        modelName: "List",
        tableName: "List",
        sequelize
      }
    )
  };

  static associate(models) {
    const { Task } = models;
    this.hasMany(Task, {
      as: "Tasks",
      foreignKey: "ListID",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }
}

module.exports = List;
