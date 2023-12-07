"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "task",
    {
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      due_date : DataTypes.DATE,
      delete_status: {
        type: DataTypes.BOOLEAN,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: "task",
      timestamps: false,
    }
  );
  Task.associate = function (models) {
    Task.hasMany(models.user_task_mapping, { foreignKey: "id", as: "task" });
  };
  return Task;
};
