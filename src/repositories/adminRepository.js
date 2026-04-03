const { User, School, Sppg, DailyReport, Review, sequelize } = require('../models');
const { Op } = require('sequelize');

const adminRepository = {
    async getProfile(id_user) {
        return await User.findOne({
            where: { 
                id_user: id_user,
                role: 'ADMIN'
            },
            attributes: [
                'name',
                'username', 
                'email', 
                'role',
            ]
        });
    },

    async getUsersByStatusAndRole(status, roles, limit, offset) {
        return await User.findAndCountAll({
            where: { 
                account_status: status, 
                role: { [Op.in]: roles } 
            },
            attributes: [
                'id_user', 
                'username', 
                'email', 
                'role', 
                'registration_code', 
                'bgn_code', 
                'createdAt'
            ],
            limit,
            offset
        });
    },

    async getAllSppg(limit, offset) {
        return await Sppg.findAndCountAll({
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['account_status'] 
            }],
            order: [['sppg_name', 'ASC']],
            limit,
            offset
        });
    },

    async getAllSchool(limit, offset) {
        return await School.findAndCountAll({
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['account_status'] 
            }],
            order: [['school_name', 'ASC']],
            limit,
            offset
        });
    },

    async findUserById(id_user) {
        return await User.findByPk(id_user);
    },

    async updateUserStatus(userInstance, status) {
        return await userInstance.update({ 
            account_status: status 
        });
    },

    async updateUser(userInstance, data) {
        return await userInstance.update(data);
    },

    async findSchoolByUserId(id_user) {
        return await School.findOne({ 
            where: { 
                id_user 
            } 
        });
    },

    async createSchoolProfile(id_user, school_name) {
        return await School.create({ 
            id_user, 
            school_name, 
            school_address: '-' 
        });
    },

    async findSppgByUserId(id_user) {
        return await Sppg.findOne({ 
            where: { 
                id_user 
            } 
        });
    },

    async createSppgProfile(id_user, sppg_name) {
        return await Sppg.create({ 
            id_user, 
            sppg_name, 
            sppg_address: '-' 
        });
    },

    async countDailyReports() {
        return await DailyReport.count();
    },

    async countUsers(role, account_status = null) {
        const whereClause = { 
            role 
        };
        if (account_status) whereClause.account_status = account_status;
        return await User.count({ 
            where: whereClause 
        });
    },
    
    async getRecentComplaints() {
        if (!Review) return [];
        return await Review.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['username'] 
            }]
        });
    },

    async getVendorWarnings() {
        if (!Review || !Sppg) return [];
        try {
            const warnings = await Review.findAll({
                attributes: [
                    'id_sppg',
                    [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
                    [sequelize.fn('COUNT', sequelize.col('id_review')), 'total_reviews']
                ],
                include: [{ model: Sppg, attributes: ['sppg_name'] }],
                group: ['Review.id_sppg', 'Sppg.id_sppg'],
                order: [[sequelize.fn('AVG', sequelize.col('rating')), 'ASC']],
                limit: 5
            });

            return warnings.map(v => ({
                nama_vendor: v.Sppg ? v.Sppg.sppg_name : 'Vendor Unknown',
                rating: parseFloat(Number(v.getDataValue('avg_rating')).toFixed(1)),
                jumlah_laporan: parseInt(v.getDataValue('total_reviews'), 10)
            }));
        } catch (error) {
            console.error('Warning: Could not fetch vendor warnings', error.message);
            return [];
        }
    },

    async findReviewById(id_review) {
        return await Review.findByPk(id_review);
    },

    async updateReviewStatus(reviewInstance, status_review) {
        return await reviewInstance.update({ 
            status_review 
        });
    },

    
    async findDashboardReviews(limit, offset) {
        return await Review.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: School,
                    as: 'school',
                    attributes: ['school_name']
                },
                {
                    model: Attachment,
                    as: 'attachments',
                    where: { entity_type: 'REVIEW' },
                    required: false,
                    attributes: ['file_url']
                },
                {
                    model: User,
                    as: "user",
                    attributes: ['username', 'role']
                }
            ],
        });
    }
};

module.exports = adminRepository;
