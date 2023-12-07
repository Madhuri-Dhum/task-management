"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("user_task_mapping", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        task_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        task_status: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["PENDING", "COMPLETED"],
          defaultValue: "PENDING",
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("NULL ON UPDATE CURRENT_TIMESTAMP"),
        },
      })
      .then(() =>
        queryInterface.addConstraint("user_task_mapping", {
          type: "foreign key",
          name: "user_id_fk",
          fields: ["user_id"],
          references: {
            table: "user",
            field: "id",
          },
          onDelete: "cascade",
        })
      )
      .then(() =>
        queryInterface.addConstraint("user_task_mapping", {
          type: "foreign key",
          name: "task_id_fk",
          fields: ["task_id"],
          references: {
            table: "task",
            field: "id",
          },
          onDelete: "cascade",
        })
      );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_task_mapping");
  },
};
