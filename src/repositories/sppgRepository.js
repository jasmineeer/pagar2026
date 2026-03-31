const { User, Sppg, DailyReport, Budget, Attachment, Review, School } = require('../models');
const { Op } = require('sequelize');

class SppgRepository {
    async findSppgByUserId(id_user) {
        return await Sppg.findOne({ 
            where: { 
                id_user 
            } 
        });
    }

    async findProfileWithUser(id_user) {
        return await Sppg.findOne({
            where: { 
                id_user 
            },
            include: [{ 
                model: User, as: 'user', 
                attributes: [
                    'username', 
                    'email', 
                    'account_status', 
                    'bgn_code'
                ] 
            }]
        });
    }

    async findDashboardReports(id_sppg, todayStart) {
        const reportToday = await DailyReport.findOne({
            where: { 
                id_sppg, 
                date_report: { 
                    [Op.gte]: todayStart 
                } 
            }
        });

        const recentReports = await DailyReport.findAll({
            where: { 
                id_sppg 
            },
            order: [['date_report', 'DESC']],
            limit: 3,
            attributes: [
                'id_daily_report', 
                'menu_name', 
                'date_report'
            ]
        });

        return { 
            reportToday, 
            recentReports 
        };
    }

    async findDashboardReviews(id_sppg) {
        const reviews = await Review.findAll({
            where: { 
                id_sppg 
            },
            include: [
                { 
                    model: School, 
                    as: 'school', 
                    attributes: ['school_name'] 
                },{ 
                    model: Attachment, 
                    as: 'attachments', 
                    where: { 
                        entity_type: 'REVIEW' 
                    }, 
                    required: false, 
                    attributes: ['file_url'] 
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 2
        });
        const totalReviews = await Review.count({ 
            where: { 
                id_sppg 
            } 
        });
        return { 
            reviews, 
            totalReviews 
        };
    }

    async getAverageEnergy(id_sppg) {
        return await DailyReport.aggregate('energy', 'avg', { 
            where: { 
                id_sppg 
            } 
        });
    }

    async getReportsByDateRange(id_sppg, startDate, endDate, attributes = null) {
        const query = { 
            where: { 
                id_sppg, 
                date_report: { 
                    [Op.between]: [startDate, endDate] 
                } 
            },
            include: [
                {  
                    model: Budget, 
                    as: 'budgets' 
                }, { 
                    model: Attachment, 
                    as: 'attachments' 
                }
            ], 
            order: [['date_report', 'ASC']]
        };
        if (attributes) query.attributes = attributes;
        return await DailyReport.findAll(query);
    }

    async findReportById(id_report, id_sppg) {
        return await DailyReport.findOne({
            where: { 
                id_daily_report: id_report, 
                id_sppg 
            },
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
    }

    async findPeriodicReportsPaginated(id_sppg, start_date, end_date, limit, offset) {
        return await DailyReport.findAndCountAll({
            where: { 
                id_sppg, 
                date_report: { 
                    [Op.between]: [start_date, end_date] 
                } 
            },
            order: [['date_report', 'ASC']],
            include: [{ 
                model: Budget, 
                as: 'budgets' 
            }],
            limit, 
            offset
        });
    }

    async findAllDailyReportsPaginated(id_sppg, limit, offset) {
        return await DailyReport.findAndCountAll({
            where: { 
                id_sppg 
            },
            order: [['date_report', 'DESC']],
            include: [
                { 
                    model: Budget, 
                    as: 'budgets' 
                },{ 
                    model: Attachment, 
                    as: 'attachments' 
                }
            ],
            limit, 
            offset
        });
    }

    async createDailyReportWithTransaction(reportData, budgetsData, attachmentsData, t) {
        const newReport = await DailyReport.create(reportData, { 
            transaction: t 
        });
        
        if (budgetsData.length > 0) {
            const parsedBudgets = budgetsData.map(b => ({
                id_daily_report: newReport.id_daily_report,
                item_name: b.item_name,
                item_price: b.item_price
            }));
            await Budget.bulkCreate(parsedBudgets, { 
                transaction: t 
            });
        }

        if (attachmentsData.length > 0) {
            const parsedAttachments = attachmentsData.map(file => ({
                entity_type: 'DAILY_REPORT',
                id_entity: newReport.id_daily_report,
                file_url: file.path,
                file_type: file.mimetype
            }));
            await Attachment.bulkCreate(parsedAttachments, { 
                transaction: t 
            });
        }

        return newReport;
    }
}

module.exports = new SppgRepository();
