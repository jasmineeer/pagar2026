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

    const schoolId = uuidv4();
    const sppgId = uuidv4();
    const dailyReportId = uuidv4();
    const attachmentId = uuidv4();
    const budgetIdBeras = uuidv4();
    const budgetIdSayur = uuidv4();

    await queryInterface.bulkInsert('user', [
      { 
        id_user: userIdAdmin, 
        role: 'ADMIN', 
        username: 'admin_malang', 
        email: 'adminMalang01@gmail.com',
        password: hashedPassword,
        account_status: 'APPROVED',
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id_user: userIdSchool, 
        role: 'SCHOOL', 
        username: 'sdn_kauman1', 
        email: 'sdnKauman1@gmail.com',
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
        email: 'sppgMalang@gmail.com',
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
        email: 'warga.malang@gmail.com',
        password: hashedPassword,
        account_status: 'APPROVED',
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ]);

    await queryInterface.bulkInsert('school', [{
      id_school: schoolId,
      id_user: userIdSchool,
      school_name: 'SDN Kauman 1 Malang',
      school_address: 'Jl. Pakisaji No. 1, Kauman, Malang',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('sppg', [{
      id_sppg: sppgId,
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
      id_daily_report: dailyReportId,
      id_sppg: sppgId,
      date_report: '2026-03-19',
      menu_name: 'Nasi Pecel Malang',
      meal_time: '12.30',
      menu_description: 'Nasi dengan sayuran rebus yang diberi bumbu kacang diatasnya.',
      total_portion: 100,
      total_expense: 500000,
      energy: 450,
      protein: 15,
      fat: 10,
      carbohydrate: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('budget', [
      {
        id_budget: budgetIdBeras,
        id_daily_report: dailyReportId,
        item_name: 'Beras',
        item_price: 300000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_budget: budgetIdSayur,
        id_daily_report: dailyReportId,
        item_name: 'Sayuran',
        item_price: 200000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);

    await queryInterface.bulkInsert('attachment', [{
      id_attachment: attachmentId,
      entity_type: 'DAILY_REPORT',
      id_entity: dailyReportId,
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
