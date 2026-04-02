const publicRepository = require('../repositories/publicRepository');
const { sequelize } = require('../models');

class PublicService {
    _buildPaginationMeta(count, page, limit) {
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        };
    }

    async getProfile(id_user) {
        const profile = await publicRepository.getProfile(id_user);

        if (!profile) {
            throw new Error('NOT_FOUND');
        }

        return profile;
    }
    
    async getSppgList() {
        return await publicRepository.findAllSppg();
    }

    async createReview(id_user, reviewBody, files) {
        const { id_sppg, title, description, rating_score } = reviewBody;

        const sppg = await publicRepository.findSppgById(id_sppg);
        if (!sppg) throw new Error('SPPG not found');

        const reviewData = {
            id_user: id_user,
            id_sppg: id_sppg,
            title,
            description,
            rating_score,
            status_review: 'MENUNGGU'
        };

        const t = await sequelize.transaction();
        try {
            const newReview = await publicRepository.createReviewWithTransaction(reviewData, files, t);
            await t.commit();
            return newReview;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getDashboardReviews(page, limit, keyword = '') {
        const offset = (page - 1) * limit;
        const { count, rows } = await publicRepository.findDashboardReviews(limit, offset, keyword);

        const formattedLaporan = rows.map(review => {
            const reviewData = review.toJSON();
            
            const userRole = reviewData.user ? reviewData.user.role : 'PUBLIC';
            const userName = reviewData.user ? reviewData.user.username : 'Anonim';
            const schoolName = reviewData.school ? reviewData.school.school_name : 'School is unknown';

            let authorName = '';
            let displayAuthor = '';

            if (userRole === 'SCHOOL') {
                authorName = userName;
                displayAuthor = `${schoolName}`;
            } else {
                authorName = 'Anonim';
                displayAuthor = `Anonim - ${schoolName}`;
            }

            return {
                ...reviewData,
                author_name: authorName,
                display_author: displayAuthor,
                school_name: schoolName,
                user: undefined 
            };
        });

        return {
            data: formattedLaporan,
            meta: this._buildPaginationMeta(
                count, 
                page, 
                limit
            )
        };
    }

    async getDashboardSppgReports(page, limit, keyword = '') {
        const offset = (page - 1) * limit;
        const { count, rows } = await publicRepository.findDashboardSppgReports(limit, offset, keyword);
        
        return {
            data: rows,
            meta: this._buildPaginationMeta(
                count, 
                page, 
                limit
            )
        };
    }

    async getDetailSppgReport(id_daily_report) {
        const report = await publicRepository.findDailyReportById(id_daily_report);
        
        if (!report) {
            throw new Error('Laporan SPPG not found');
        }
        
        return report;
    }
}

module.exports = new PublicService();
