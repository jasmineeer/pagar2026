'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('review', 'status_review', {
      type: Sequelize.ENUM('MENUNGGU', 'INVESTIGASI', 'SELESAI'),
      allowNull: false,
      defaultValue: 'MENUNGGU'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('review', 'status_review');
  }
};