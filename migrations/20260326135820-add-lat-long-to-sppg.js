'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sppg', 'latitude', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('sppg', 'longitude', {
      type: Sequelize.STRING, 
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Fitur rollback jika migration dibatalkan
    await queryInterface.removeColumn('sppg', 'latitude');
    await queryInterface.removeColumn('sppg', 'longitude');
  }
};