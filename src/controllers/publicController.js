const publicService = require('../service/publicService');

const getPaginationParams = (query, defaultLimit = 10) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    const keyword = query.search || ''; 
    return { page, limit, keyword };
};

class PublicController {
    async getProfile(req, res, next) {
        try {
            const profile = await publicService.getProfile(req.user.id_user);
            
            return res.status(200).json({ 
                status: 'success', 
                data: profile 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Public Profile not found' 
                });
            }
            next(error);
        }
    }

    async getSppgList(req, res) {
        try {
            const sppgList = await publicService.getSppgList();
            
            return res.status(200).json({
                status: 'success',
                data: sppgList
            });
        } catch (error) {
            console.error('Error getSppgList:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async createReview(req, res) {
        try {
            const id_user = req.user ? req.user.id_user : null; 
            
            const newReview = await publicService.createReview(id_user, req.body, req.files);
            
            return res.status(201).json({ 
                status: 'success', 
                data: newReview 
            });
        } catch (error) {
            console.error('Error createReview (Public):', error);
            if (error.message === 'SPPG not found') {
                return res.status(404).json({ 
                    message: error.message 
                });
            }
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getDashboardReviews(req, res) {
        try {
            const { page, limit, keyword } = getPaginationParams(req.query, 15);
            const result = await publicService.getDashboardReviews(page, limit, keyword);
            
            return res.status(200).json({
                status: 'success',
                data: result.data || result, 
                meta: result.meta
            });
        } catch (error) {
            console.error('Error getDashboardReviews (Public):', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getDashboardSppgReports(req, res) {
        try {
            const { page, limit, keyword } = getPaginationParams(req.query, 15);
            const result = await publicService.getDashboardSppgReports(page, limit, keyword);
            
            return res.status(200).json({
                status: 'success',
                data: result.data || result,
                meta: result.meta
            });
        } catch (error) {
            console.error('Error getDashboardSppgReports:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getDetailSppgReport(req, res) {
        try {
            const { id_daily_report } = req.params; 
            
            const detailReport = await publicService.getDetailSppgReport(id_daily_report);
            
            return res.status(200).json({
                status: 'success',
                data: detailReport
            });
        } catch (error) {
            console.error('Error getDetailSppgReport:', error);
            
            if (error.message === 'Laporan SPPG not found') {
                return res.status(404).json({ 
                    message: error.message 
                });
            }
            
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new PublicController();
