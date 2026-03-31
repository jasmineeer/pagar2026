const publicRepository = require('../repositories/publicRepository');
const { sequelize } = require('../models');

class PublicService {
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

    async getDashboardReviews() {
        const publicReviews = await publicRepository.findDashboardReviews();

        return publicReviews.map(review => {
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
                displayAuthor = `Anonim - ${locationDisplay}`;
            }

            return {
                ...reviewData,
                author_name: authorName,
                display_author: displayAuthor,
                location_name: locationDisplay,
                user: undefined 
            };
        });
    }

    async getDashboardSppgReports() {
        return await publicRepository.findDashboardSppgReports();
    }
}

module.exports = new PublicService();
