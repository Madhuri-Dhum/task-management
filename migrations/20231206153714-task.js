"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("task", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        due_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        delete_status: {
          type: Sequelize.BOOLEAN,
          defaultValue: "0",
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user");
  },
};
