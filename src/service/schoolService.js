const schoolRepository = require('../repositories/schoolRepository');
const { sequelize } = require('../models');

class SchoolService {
    _buildPaginationMeta(count, page, limit) {
        return {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            limit: limit
        };
    }

    async getSppgList(page, limit) {
        const offset = (page - 1) * limit;
        const { count, rows } = await schoolRepository.findAndCountAllSppg(limit, offset);
        
        return {
            data: rows,
            meta: this._buildPaginationMeta(
                count, 
                page, 
                limit
            )
        };
    }

    async getProfile(id_user) {
        const school = await schoolRepository.findSchoolByUserId(id_user);
        if (!school) throw new Error('School profile not found');
        return school;
    }

    async updateProfile(id_user, school_name, school_address) {
        const school = await schoolRepository.findSchoolByUserId(id_user);
        if (!school) throw new Error('School profile not found');

        return await schoolRepository.updateSchoolProfile(school, {
            school_name,
            school_address
        });
    }

    async getDailyReports(page, limit) {
        const offset = (page - 1) * limit;
        const { count, rows } = await schoolRepository.findAndCountAllDailyReports(limit, offset);
        
        return {
            data: rows,
            meta: this._buildPaginationMeta(
                count, 
                page, 
                limit
            )
        };
    }

    async createReview(id_user, reviewBody, files) {
        const school = await schoolRepository.findSchoolByUserId(id_user);
        if (!school) throw new Error('School Profile not found');

        const { id_sppg, title, description, rating_score } = reviewBody;

        const sppg = await schoolRepository.findSppgById(id_sppg);
        if (!sppg) throw new Error('Instansi SPPG not found');

        const reviewData = {
            id_user: id_user,
            id_school: school.id_school,
            id_sppg: id_sppg,
            title,
            description,
            rating_score,
            status_review: 'MENUNGGU'
        };

        const t = await sequelize.transaction();
        try {
            const newReview = await schoolRepository.createReviewWithTransaction(reviewData, files, t);
            await t.commit();
            return newReview;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getDashboardReviews(page, limit, keyword = '') {
        const offset = (page - 1) * limit;
        const { count, rows } = await schoolRepository.findAndCountDashboardReviews(limit, offset, keyword);

        const formattedLaporan = rows.map(review => {
            const reviewData = review.toJSON();
            
            const userRole = reviewData.user ? reviewData.user.role : 'PUBLIC';
            const userName = reviewData.user ? reviewData.user.username : 'Anonim';
            const schoolName = reviewData.school ? reviewData.school.school_name : null;
            const sppgName = reviewData.sppg ? reviewData.sppg.sppg_name : null;
            const locationDisplay = schoolName || sppgName || 'Location is unknown';

            let authorName = '';
            let displayAuthor = '';

            if (userRole === 'SCHOOL') {
                authorName = userName;
                displayAuthor = `${locationDisplay}`;
            } else {
                authorName = 'Anonim';
                displayAuthor = `${locationDisplay}`;
            }

            return {
                ...reviewData,
                author_name: authorName,
                display_author: displayAuthor,
                school_name: schoolName,
                locationName: locationDisplay,
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
        const { count, rows } = await schoolRepository.findAndCountDashboardSppgReports(limit, offset, keyword);
        
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
        const report = await schoolRepository.findDailyReportById(id_daily_report);
            
        if (!report) {
            throw new Error('Laporan SPPG not found');
        }
            
        return report;
    }
}

module.exports = new SchoolService();
