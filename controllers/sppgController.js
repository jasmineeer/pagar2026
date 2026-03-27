const { User, Sppg, DailyReport, Budget, Attachment, Review, School, sequelize } = require('../models');
const { Op } = require('sequelize');

const sppgController = {

    async getProfile(req, res) {
        try {
            const id_user = req.user.id_user;
            const sppgProfile = await Sppg.findOne({
                where: { id_user: id_user },
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: [
                        'username', 
                        'account_status', 
                        'bgn_code'
                    ] 
                }]
            });

            if (!sppgProfile) return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found.' 
            });
            return res.status(200).json({ 
                status: 'success', 
                data: sppgProfile 
            });
        } catch (error) {
            console.error('Error getProfile:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async updateProfile(req, res) {
        try {
            const id_user = req.user.id_user;
            const { sppg_name, sppg_address, latitude, longitude } = req.body;

            const sppgProfile = await Sppg.findOne({ 
                where: { 
                    id_user: id_user 
                } 
            });
            if (!sppgProfile) return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found.' 
            });

            await sppgProfile.update({
                sppg_name: sppg_name || sppgProfile.sppg_name,
                sppg_address: sppg_address || sppgProfile.sppg_address,
                latitude,
                longitude
            });

            return res.status(200).json({ 
                status: 'success', 
                message: 'Profile updated', 
                data: sppgProfile 
            });
        } catch (error) {
            console.error('Error updateProfile:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getDashboardData(req, res) {
        try {
            const id_user = req.user.id_user;
            const sppg = await Sppg.findOne({ 
                where: { 
                    id_user 
                } 
            });
            
            if (!sppg) return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found.' 
            });

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const reportToday = await DailyReport.findOne({
                where: {
                    id_sppg: sppg.id_sppg,
                    date_report: { [Op.gte]: today }
                }
            });
            const isReportedToday = reportToday ? 'SELESAI' : 'BELUM';

            const recentReports = await DailyReport.findAll({
                where: { 
                    id_sppg: sppg.id_sppg 
                },
                order: [['date_report', 'DESC']],
                limit: 3,
                attributes: [
                    'id_daily_report', 
                    'menu_name', 
                    'date_report'
                ]
            });

            const communityReviews = await Review.findAll({
                where: { 
                    id_sppg: sppg.id_sppg 
                },
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
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: 2
            });

            const totalReviewsCount = await Review.count({
                where: { 
                    id_sppg: sppg.id_sppg 
                }
            });

            const averageEnergy = await DailyReport.aggregate('energy', 'avg', {
                where: { 
                    id_sppg: sppg.id_sppg 
                }
            });

            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const currentMonthReports = await DailyReport.findAll({
                where: {
                    id_sppg: sppg.id_sppg,
                    date_report: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lte]: lastDayOfMonth
                    }
                },
                include: [{
                    model: Budget,
                    as: 'budgets',
                    attributes: ['total_price']
                }]
            });

            let totalPengeluaranBulanIni = 0;
            currentMonthReports.forEach(report => {
                report.budgets.forEach(b => {
                    totalPengeluaranBulanIni += Number(b.total_price);
                });
            });

            let sisaAnggaran = null; 
            if (sppg.monthly_budget !== null && sppg.monthly_budget > 0) {
                sisaAnggaran = sppg.monthly_budget - totalPengeluaranBulanIni;
            }

            return res.status(200).json({
                status: 'success',
                message: 'Data Dashboard berhasil dimuat',
                data: {
                    sppg_name: sppg.sppg_name,
                    widgets: {
                        status_hari_ini: isReportedToday,
                        rata_rata_kalori: Math.round(averageEnergy) || 0,
                        sisa_anggaran: sisaAnggaran,
                        total_laporan_masyarakat: totalReviewsCount
                    },
                    riwayat_laporan: recentReports,
                    laporan_masyarakat: communityReviews
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

    async getDailyReportById(req, res) {
        try {
            const { id_report } = req.params;
            const id_user = req.user.id_user;
      
            const sppg = await Sppg.findOne({ 
                where: { 
                    id_user 
                } 
            });
            if (!sppg) return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found.' 
            });

            const report = await DailyReport.findOne({
                where: { 
                    id_daily_report: id_report, 
                    id_sppg: sppg.id_sppg 
                },
                include: [
                    { 
                        model: Budget, 
                        as: 'budgets' 
                    },{ 
                        model: Attachment, 
                        as: 'attachments' }
                ]
            });

            if (!report) return res.status(404).json({ 
                status: 'error', 
                message: 'Report not found' 
            });
            return res.status(200).json({ 
                status: 'success', 
                data: report 
            });
        } catch (error) {
            console.error('Error getDailyReportById:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getPeriodicReports(req, res) {
        try {
            const id_user = req.user.id_user;
            const { start_date, end_date } = req.query;

            const sppg = await Sppg.findOne({ 
                where: { 
                    id_user 
                } 
            });

            if (!sppg) return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found.' 
            });

            if (!start_date || !end_date) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'start_date and end_date queries are required.' 
                });
            }

            const reports = await DailyReport.findAll({
                where: {
                    id_sppg: sppg.id_sppg,
                    date_report: { [Op.between]: [start_date, end_date] }
                },
                order: [['date_report', 'ASC']],
                include: [{ 
                    model: Budget, 
                    as: 'budgets' 
                }]
            });

            let total_budget_period = 0;
            reports.forEach(report => {
                report.budgets.forEach(b => {
                total_budget_period += Number(b.total_price);
                });
            });

            return res.status(200).json({
                status: 'success',
                data: {
                    period: { 
                        start_date, 
                        end_date 
                    },
                    total_reports: reports.length,
                    total_budget_spent: total_budget_period,
                    reports: reports
                }
            });
        } catch (error) {
            console.error('Error getPeriodicReports:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async getDailyReports(req, res) {
        try {
            const id_user = req.user.id_user;
            const sppg = await Sppg.findOne({ 
                where: { 
                    id_user 
                } 
            });
      
            if (!sppg) return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found.' 
            });

            const reports = await DailyReport.findAll({
                where: { id_sppg: sppg.id_sppg },
                order: [['date_report', 'DESC']],
                include: [
                    { 
                        model: Budget, 
                        as: 'budgets' 
                    },{ 
                        model: Attachment, 
                        as: 'attachments' 
                    }
                ] 
            });

            return res.status(200).json({ 
                status: 'success', 
                data: reports 
            });
        } catch (error) {
            console.error('Error getDailyReports:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async createDailyReport(req, res) {
        const t = await sequelize.transaction();

        try {
            const id_user = req.user.id_user;
            const sppg = await Sppg.findOne({ 
                where: { 
                    id_user 
                } 
            });

            if (!sppg) {
                await t.rollback();
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'SPPG Profile not found.' 
                });
            }

            const { 
                date_report, 
                menu_name, 
                meal_time, 
                total_portion, 
                energy, 
                protein, 
                fat, 
                carbohydrate, 
                budgets 
            } = req.body;

            const newReport = await DailyReport.create({
                id_sppg: sppg.id_sppg,
                date_report,
                menu_name,
                meal_time,
                total_portion,
                energy,
                protein,
                fat,
                carbohydrate
            }, { transaction: t });

            if (budgets) {
                const parsedBudgets = typeof budgets === 'string' ? JSON.parse(budgets) : budgets;
        
                if (parsedBudgets.length > 0) {
                    const budgetData = parsedBudgets.map(b => {
                        const calculatedTotal = Number(b.qty) * Number(b.item_price);

                        return {
                            id_daily_report: newReport.id_daily_report,
                            item_name: b.item_name,
                            item_price: b.item_price,
                            total_price: calculatedTotal
                        };
                    });
          
                    await Budget.bulkCreate(budgetData, { transaction: t });
                }
            }

            if (req.files && req.files.length > 0) {
                const attachmentData = req.files.map(file => ({
                    entity_type: 'DAILY_REPORT',
                    id_entity: newReport.id_daily_report,
                    file_url: file.path,
                    file_type: file.mimetype
                }));
                await Attachment.bulkCreate(attachmentData, { 
                    transaction: t 
                });
            }

            await t.commit();

            return res.status(201).json({ 
                status: 'success', 
                message: 'Daily report created successfully.',
                data: { 
                    id_daily_report: newReport.id_daily_report 
                }
            });

        } catch (error) {
            await t.rollback();
            console.error('Error createDailyReport:', error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Internal server error' 
            });
        }
    },

    async updateMonthlyBudget(req, res) {
        try {
            const id_user = req.user.id_user;
            const { monthly_budget } = req.body; 

            if (monthly_budget === undefined || monthly_budget === null) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Monthly budget is required' 
                });
            }

            const sppg = await Sppg.findOne({ 
                where: { 
                    id_user 
                } 
            });
            if (!sppg) {
                return res.status(404).json({ 
                    message: 'Data SPPG not found' 
                });
            }

            await sppg.update({ monthly_budget });

            return res.status(200).json({
                status: 'success',
                message: 'Monthly budget inserted successfully',
                data: {
                    sppg_name: sppg.sppg_name,
                    monthly_budget: sppg.monthly_budget
                }
            });

        } catch (error) {
            console.error('Error updateMonthlyBudget:', error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }

};

module.exports = sppgController;
