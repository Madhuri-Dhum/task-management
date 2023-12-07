"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      delete_status: {
        type: DataTypes.BOOLEAN,
      },
      completed_task : DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: "user",
      timestamps: false,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );
  User.associate = function (models) {
    User.hasMany(models.user_task_mapping, { foreignKey: "id", as: "user" });
  };
  return User;
};
