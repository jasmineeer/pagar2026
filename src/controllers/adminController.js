const { User, School, Sppg, DailyReport, Review, sequelize } = require('../../models');
const { Op } = require('sequelize');

const adminController = {
    async getPendingAccounts(req, res) {
        try {
            const pendingUsers = await User.findAll({
                where: {
                    account_status: 'PENDING',
                    role: { [Op.in]: ['SPPG', 'SCHOOL'] }
                },
                attributes: [
                    'id_user', 
                    'username', 
                    'email', 
                    'role', 
                    'registration_code', 
                    'bgn_code', 
                    'createdAt'
                ]
            });

            return res.status(200).json({ 
                status: 'success', 
                data: pendingUsers 
            });
        } catch (error) {
            console.error('Error getPendingAccounts:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getActiveAccounts(req, res) {
        try {
            const activeUsers = await User.findAll({
                where: {
                    account_status: 'APPROVED',
                    role: { [Op.in]: ['SPPG', 'SCHOOL'] }
                },
                attributes: [
                    'id_user', 
                    'username', 
                    'email', 
                    'role', 
                    'createdAt'
                ]
            });

            return res.status(200).json({ 
                status: 'success', 
                data: activeUsers 
            });
        } catch (error) {
            console.error('Error getActiveAccounts:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getAllSppg(req, res) {
        try {
            const sppgs = await Sppg.findAll({
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['account_status']
                }],
                order: [[
                    'sppg_name', 
                    'ASC'
                ]] 
            });

            return res.status(200).json({
                status: 'success',
                data: sppgs
            });
        } catch (error) {
            console.error('Error getAllSppg:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getAllSchool(req, res) {
        try {
            const schools = await School.findAll({
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['account_status']
                }],
                order: [[
                    'school_name', 
                    'ASC'
                ]] 
            });

            return res.status(200).json({
                status: 'success',
                data: schools
            });
        } catch (error) {
            console.error('Error getAllSchool:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async updateAccountStatus(req, res) {
        try {
            const { id_user } = req.params;
            const { status } = req.body;

            if (!['APPROVED', 'REJECTED'].includes(status)) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Invalid status. Use APPROVED or REJECTED.' 
                });
            }

            const user = await User.findByPk(id_user);
            if (!user) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'User not found' 
                });
            }

            await user.update({ account_status: status });

            if (status === 'APPROVED') {
                if (user.role === 'SCHOOL') {
                    const existingSchool = await School.findOne({ 
                        where: { 
                            id_user: user.id_user 
                        } 
                    });

                    if (!existingSchool) {
                        await School.create({
                            id_user: user.id_user,
                            school_name: `New School (${user.username})`,
                            school_address: '-'
                        });
                    }
                } 
                else if (user.role === 'SPPG') {
                    const existingSppg = await Sppg.findOne({ 
                        where: { 
                            id_user: user.id_user 
                        } 
                    });

                    if (!existingSppg) {
                        await Sppg.create({
                            id_user: user.id_user,
                            sppg_name: `New Vendor (${user.username})`,
                            sppg_address: '-'
                        });
                    }
                }
            }

            return res.status(200).json({
                status: 'success',
                message: `Account has been successfully ${status.toLowerCase()}. Profile created if approved.`,
                data: { 
                    id_user: user.id_user, 
                    account_status: user.account_status 
                }
            });
        } catch (error) {
            console.error('Error updateAccountStatus:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async updateProfile(req, res) {
        try {
            const id_user = req.user.id_user; 
            const { name, username, email, password } = req.body;

            const admin = await User.findByPk(id_user);
            if (!admin) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Admin profile not found' 
                });
            }

            let updateData = {
                name: name || admin.name,
                username: username || admin.username,
                email: email || admin.email
            };

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }

            await admin.update(updateData);

            return res.status(200).json({
                status: 'success',
                message: 'Admin profile updated successfully.',
                data: {
                    id_user: admin.id_user,
                    name: admin.name,
                    username: admin.username,
                    email: admin.email
                }
            });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Username or email have been used.'
                });
            }
            console.error('Error updateProfile:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getDashboardData(req, res) {
        try {
            const totalReports = await DailyReport.count();
            const totalSppg = await User.count({ 
                where: { 
                    role: 'SPPG', 
                    account_status: 'APPROVED' 
                } 
            });
            const totalSchool = await User.count({ 
                where: { 
                    role: 'SCHOOL', 
                    account_status: 'APPROVED' 
                } 
            });
            const totalPublic = await User.count({ 
                where: { 
                    role: 'PUBLIC' 
                } 
            });

            let recentComplaints = [];
            if (Review) {
                recentComplaints = await Review.findAll({
                    order: [['createdAt', 'DESC']],
                    limit: 5,
                    include: [{ 
                        model: User, 
                        as: 'user',
                        attributes: ['username'] 
                    }]
                });
            }

            let vendorWarnings = [];
            if (Review && Sppg) {
                try {
                    const warningsData = await Review.findAll({
                        attributes: [
                            'id_sppg',
                            [
                                sequelize.fn(
                                    'AVG', 
                                    sequelize.col('rating')), 
                                    'avg_rating'
                            ], [
                                sequelize.fn(
                                    'COUNT', 
                                    sequelize.col('id_review')), 
                                    'total_reviews'
                                ]
                        ],
                        include: [{
                            model: Sppg,
                            attributes: ['sppg_name']
                        }],
                        group: ['Review.id_sppg', 'Sppg.id_sppg'], 
                        order: [
                            [
                                sequelize.fn(
                                    'AVG', 
                                    sequelize.col('rating')), 
                                    'ASC'
                            ]
                        ],
                        limit: 5 
                    });

                    vendorWarnings = warningsData.map(v => ({
                        nama_vendor: v.Sppg ? v.Sppg.sppg_name : 'Vendor Unknown', 
                        rating: parseFloat(Number(v.getDataValue('avg_rating')).toFixed(1)),
                        jumlah_laporan: parseInt(v.getDataValue('total_reviews'), 10)
                    }));
                } catch (warningError) {
                    console.error('Warning: Could not fetch vendor warnings', warningError.message);
                }
            }

            return res.status(200).json({
                status: 'success',
                data: { 
                    statistics: { 
                        totalReports, 
                        totalSppg, 
                        totalSchool, 
                        totalPublic 
                    },
                    recent_complaints: recentComplaints,
                    vendor_warnings: vendorWarnings
                }
            });
        } catch (error) {
            console.error('Error getDashboardData:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async updateReviewStatus(req, res) {
        try {
            const { id_review } = req.params;
            const { status_review } = req.body;

            if (!['MENUNGGU', 'INVESTIGASI', 'SELESAI'].includes(status_review)) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Invalid status.' 
                });
            }

            const review = await Review.findByPk(id_review);
            if (!review) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Review not found' 
                });
            }

            await review.update({ status_review });

            return res.status(200).json({
                status: 'success',
                message: 'Review status updated successfully.',
                data: review
            });
        } catch (error) {
            console.error('Error updateReviewStatus:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    }
};

module.exports = adminController;
