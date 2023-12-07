"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("user", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
        },
        completed_task: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
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
