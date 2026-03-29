'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('budget', 'total_price');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('budget', 'total_price', {
      type: Sequelize.BIGINT,
      allowNull: true
    });
  }
};
