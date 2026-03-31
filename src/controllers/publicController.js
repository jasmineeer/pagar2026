const publicService = require('../service/publicService');

class PublicController {
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
            const formattedLaporan = await publicService.getDashboardReviews();
            
            return res.status(200).json({
                status: 'success',
                data: formattedLaporan
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
            const laporanSppg = await publicService.getDashboardSppgReports();
            
            return res.status(200).json({
                status: 'success',
                data: laporanSppg
            });
        } catch (error) {
            console.error('Error getDashboardSppgReports:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new PublicController();
