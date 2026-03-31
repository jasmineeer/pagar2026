const { School, DailyReport, Sppg, Review, Attachment, User } = require('../models');

class PublicRepository {
    async findAllSppg() {
        return await Sppg.findAll({
            attributes: [
                'id_sppg', 
                'sppg_name', 
                'sppg_address'
            ],
            order: [['sppg_name', 'ASC']]
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

    async findDashboardReviews() {
        return await Review.findAll({
            order: [['createdAt', 'DESC']],
            limit: 15,
            include: [
                {
                    model: School,
                    as: 'school',
                    attributes: ['school_name']
                },
                {
                    model: Sppg,
                    as: 'sppg',
                    attributes: ['sppg_name']
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
                    as: 'user', 
                    attributes: ['username', 'role']
                }
            ]
        });
    }

    async findDashboardSppgReports() {
        return await DailyReport.findAll({
            order: [['createdAt', 'DESC']],
            limit: 15,
            include: [
                {
                    model: Sppg,
                    as: 'sppg',
                    attributes: ['sppg_name', 'sppg_address']
                },
                {
                    model: Attachment,
                    as: 'attachments',
                    where: { entity_type: 'DAILY_REPORT' },
                    required: false,
                    attributes: ['file_url']
                }
            ]
        });
    }
}

module.exports = new PublicRepository();
