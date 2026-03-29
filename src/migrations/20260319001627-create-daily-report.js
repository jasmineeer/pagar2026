'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_report', {
      id_daily_report: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_sppg: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sppg',
          key: 'id_sppg'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date_report: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      menu_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      meal_time: {
        type: Sequelize.STRING
      },
      total_portion: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      menu_description: {
        type: Sequelize.TEXT
      },
      energy: {
        type: Sequelize.FLOAT
      },
      protein: {
        type: Sequelize.FLOAT
      },
      fat: {
        type: Sequelize.FLOAT
      },
      carbohydrate: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('daily_report');
  }
};