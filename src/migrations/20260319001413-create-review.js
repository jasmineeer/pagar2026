'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('review', {
      id_review: {
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
      id_school: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { 
          model: 'school', 
          key: 'id_school' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_user: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { 
          model: 'user', 
          key: 'id_user' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_anonymous: {
        type: Sequelize.BOOLEAN
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      rating_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { 
          min: 1,
          max: 5 
        }
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
    await queryInterface.dropTable('review');
  }
};