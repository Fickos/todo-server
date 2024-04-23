const { Sequelize, DataTypes } = require('sequelize');

class Task extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        TaskID: {
          type: DataTypes.BIGINT,
          field: "TaskID",
          primaryKey: true,
          autoIncrement: true,
        },
        Content: {
          type: DataTypes.STRING,
          field: "Content",
          allowNull: false,
        },
        Location: {
          type: DataTypes.STRING,
          field: "Location",
          allowNull: false,
        },
        CreatedAt: {
          type: DataTypes.DATE,
          field: "CreatedAt",
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        modelName: "Task",
        tableName: "Task",
        sequelize
      }
    )
  };

  static associate(models) {
    const { List } = models;

    this.belongsTo(List, {
      foreignKey: {
        name: "ListID",
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      }
    });
  }
}

module.exports = Task;
