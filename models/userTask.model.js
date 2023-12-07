"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserTaskMapping = sequelize.define(
    "user_task_mapping",
    {
      user_id: DataTypes.INTEGER,
      task_id: DataTypes.INTEGER,
      task_status : DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: "user_task_mapping",
      timestamps: false,
    }
  );
  UserTaskMapping.associate = function (models) {
    UserTaskMapping.belongsTo(models.user, { foreignKey: "user_id", as: "user" });
    UserTaskMapping.belongsTo(models.task, { foreignKey: "task_id", as: "task" });
  };
  return UserTaskMapping;
};
