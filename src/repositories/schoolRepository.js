const { School, DailyReport, Sppg, Review, Attachment, User } = require('../models');

class SchoolRepository {
    async findAndCountAllSppg(limit, offset) {
        return await Sppg.findAndCountAll({
            attributes: [
                'id_sppg', 
                'sppg_name', 
                'sppg_address'
            ],
            order: [['sppg_name', 'ASC']],
            limit,
            offset
        });
    }

    async findSchoolByUserId(id_user) {
        return await School.findOne({ 
            where: { 
                id_user 
            } 
        });
    }

    async updateSchoolProfile(school, updateData) {
        return await school.update(updateData);
    }

    async findAndCountAllDailyReports(limit, offset) {
        return await DailyReport.findAndCountAll({
            order: [['date_report', 'DESC']],
            limit,
            offset,
            include: [{
                model: Sppg,
                as: 'sppg',
                attributes: [
                    'sppg_name', 
                    'sppg_address'
                ]
            }],
            distinct: true
        });
    }

    async findSppgById(id_sppg) {
        return await Sppg.findByPk(id_sppg);
    }

    async createReviewWithTransaction(reviewData, attachmentData, t) {
        const newReview = await Review.create(reviewData, { transaction: t });
        
        if (attachmentData && attachmentData.length > 0) {
            const mappedAttachments = attachmentData.map(file => ({
                entity_type: 'REVIEW',
                id_entity: newReview.id_review,
                file_url: file.path,
                file_type: file.mimetype
            }));
            await Attachment.bulkCreate(mappedAttachments, { transaction: t });
        }
        
        return newReview;
    }

    async findAndCountDashboardReviews(limit, offset) {
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
            distinct: true
        });
    }

    async findAndCountDashboardSppgReports(limit, offset) {
        return await DailyReport.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Sppg,
                    as: 'sppg',
                    attributes: [
                        'sppg_name', 
                        'sppg_address'
                    ]
                },
                {
                    model: Attachment,
                    as: 'attachments',
                    where: { entity_type: 'DAILY_REPORT' },
                    required: false,
                    attributes: ['file_url']
                }
            ],
            distinct: true
        });
    }
}

module.exports = new SchoolRepository();
