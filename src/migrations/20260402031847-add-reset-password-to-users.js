'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'reset_password_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('user', 'reset_password_expires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'reset_password_token');
    await queryInterface.removeColumn('user', 'reset_password_expires');
  }
};
