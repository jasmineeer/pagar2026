const schoolService = require('../service/schoolService');

const getPaginationParams = (query, defaultLimit = 10) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    const keyword = query.search || '';
    return { page, limit, keyword };
};

class SchoolController {
    async getSppgList(req, res, next) {
        try {
            const { page, limit } = getPaginationParams(req.query, 20);
            const result = await schoolService.getSppgList(page, limit);
            
            return res.status(200).json({
                status: 'success',
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const school = await schoolService.getProfile(req.user.id_user);
            return res.status(200).json({ 
                status: 'success', 
                data: school 
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { school_name, school_address } = req.body;
            const updatedSchool = await schoolService.updateProfile(req.user.id_user, school_name, school_address);
            
            return res.status(200).json({ 
                status: 'success', 
                message: 'Profile updated', 
                data: updatedSchool 
            });
        } catch (error) {
            next(error);
        }
    }

    async getDailyReports(req, res, next) {
        try {
            const { page, limit } = getPaginationParams(req.query, 10);
            const result = await schoolService.getDailyReports(page, limit, keyword);
            
            return res.status(200).json({ 
                status: 'success', 
                data: result.data,
                meta: result.meta 
            });
        } catch (error) {
            next(error);
        }
    }

    async createReview(req, res, next) {
        try {
            const newReview = await schoolService.createReview(req.user.id_user, req.body, req.files);
            
            return res.status(201).json({ 
                status: 'success', 
                message: 'Review has been sent', 
                data: newReview 
            });
        } catch (error) {
            next(error);
        }
    }

    async getDashboardReviews(req, res, next) {
        try {
            const { page, limit, keyword } = getPaginationParams(req.query, 15);
            const result = await schoolService.getDashboardReviews(page, limit, keyword);
            
            return res.status(200).json({
                status: 'success',
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    }

    async getDashboardSppgReports(req, res, next) {
        try {
            const { page, limit, keyword } = getPaginationParams(req.query, 15);
            const result = await schoolService.getDashboardSppgReports(page, limit, keyword);
            
            return res.status(200).json({
                status: 'success',
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            next(error);
        }
    }

    async getDetailSppgReport(req, res, next) {
        try {
            const { id_daily_report } = req.params; 
                
            const detailReport = await schoolService.getDetailSppgReport(id_daily_report);
                
            return res.status(200).json({
                status: 'success',
                data: detailReport
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SchoolController();
