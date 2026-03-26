'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const userIdAdmin = uuidv4();
    const userIdSchool = uuidv4();
    const userIdSppg = uuidv4();
    const userIdPublic = uuidv4();

    await queryInterface.bulkInsert('user', [
      { 
        id_user: userIdAdmin, 
        role: 'ADMIN', 
        username: 'admin_malang', 
        password: hashedPassword,
        account_status: 'APPROVED',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id_user: userIdSchool, 
        role: 'SCHOOL', 
        username: 'sdn_kauman1', 
        password: hashedPassword, 
        registration_code: 'SCH-KMN-001',
        bgn_code: null,
        account_status: 'APPROVED',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id_user: userIdSppg, 
        role: 'SPPG', 
        username: 'sppg_malang', 
        password: hashedPassword, 
        registration_code: null, 
        bgn_code: 'BGN-001',
        account_status: 'APPROVED',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id_user: userIdPublic, 
        role: 'PUBLIC', 
        username: 'warga_malang', 
        password: hashedPassword,
        account_status: 'APPROVED',
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ]);

    await queryInterface.bulkInsert('school', [{
      id_school: 1,
      id_user: userIdSchool,
      school_name: 'SDN Kauman 1 Malang',
      school_address: 'Jl. Pakisaji No. 1, Kauman, Malang',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('sppg', [{
      id_sppg: 1,
      id_user: userIdSppg,
      sppg_name: 'SPPG Sehat Malang',
      sppg_address: 'Jl. Lowokwaru No. 5, Malang',
      latitude: '-7.946713',
      longitude: '112.615668',
      monthly_budget: 15000000,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('daily_report', [{
      id_daily_report: 1,
      id_sppg: 1,
      date_report: '2026-03-19',
      menu_name: 'Nasi Pecel Malang',
      meal_time: '12.30',
      total_portion: 100,
      energy: 450,
      protein: 15,
      fat: 10,
      carbohydrate: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('budget', [{
      id_budget: 1,
      id_daily_report: 1,
      item_name: 'Beras & Sayur',
      item_price: 500000,
      total_price: 500000,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('attachment', [{
      id_attachment: 1,
      entity_type: 'DAILY_REPORT',
      id_entity: 1,
      file_url: 'https://res.cloudinary.com/demo/image/upload/v1/malang_food.jpg',
      file_type: 'image/jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attachment', null, {});
    await queryInterface.bulkDelete('budget', null, {});
    await queryInterface.bulkDelete('daily_report', null, {});
    await queryInterface.bulkDelete('sppg', null, {});
    await queryInterface.bulkDelete('school', null, {});
    await queryInterface.bulkDelete('user', null, {});
  }
};