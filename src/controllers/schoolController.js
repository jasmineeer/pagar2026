const schoolService = require('../services/schoolService');

class SchoolController {
    _getPaginationParams(query, defaultLimit = 10) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || defaultLimit;
        return { page, limit };
    }

    async getSppgList(req, res) {
        try {
            const { page, limit } = this._getPaginationParams(req.query, 20);
            const result = await schoolService.getSppgList(page, limit);
            
            return res.status(200).json({
                status: 'success',
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            console.error('Error getSppgList:', error);
            return res.status(500).json({ 
                message: 'Internal server error', 
                error: error.message 
            });
        }
    }

    async getProfile(req, res) {
        try {
            const school = await schoolService.getProfile(req.user.id_user);
            return res.status(200).json({ 
                status: 'success', 
                data: school 
            });
        } catch (error) {
            console.error(error);
            if (error.message === 'School profile not found') {
                return res.status(404).json({ 
                    message: error.message 
                });
            }
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const { school_name, school_address } = req.body;
            const updatedSchool = await schoolService.updateProfile(req.user.id_user, school_name, school_address);
            
            return res.status(200).json({ 
                status: 'success', 
                message: 'Profile updated', 
                data: updatedSchool 
            });
        } catch (error) {
            console.error(error);
            if (error.message === 'School profile not found') {
                return res.status(404).json({ 
                    message: error.message 
                });
            }
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }

    async getDailyReports(req, res) {
        try {
            const { page, limit } = this._getPaginationParams(req.query, 10);
            const result = await schoolService.getDailyReports(page, limit);
            
            return res.status(200).json({ 
                status: 'success', 
                data: result.data,
                meta: result.meta 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }

    async createReview(req, res) {
        try {
            const newReview = await schoolService.createReview(req.user.id_user, req.body, req.files);
            
            return res.status(201).json({ 
                status: 'success', 
                message: 'Review has been sent', 
                data: newReview 
            });
        } catch (error) {
            console.error('Error createReview (School):', error);
            if (['Profil sekolah tidak ditemukan', 'Instansi SPPG not found'].includes(error.message)) {
                return res.status(404).json({ 
                    message: error.message 
                });
            }
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }

    async getDashboardReviews(req, res) {
        try {
            const { page, limit } = this._getPaginationParams(req.query, 15);
            const result = await schoolService.getDashboardReviews(page, limit);
            
            return res.status(200).json({
                status: 'success',
                data: result.data,
                meta: result.meta
            });
        } catch (error) {
            console.error('Error getDashboardReviews:', error);
            return res.status(500).json({ 
                message: 'Internal server error', 
                error: error.message 
            });
        }
    }

    async getDashboardSppgReports(req, res) {
        try {
            const { page, limit } = this._getPaginationParams(req.query, 15);
            const result = await schoolService.getDashboardSppgReports(page, limit);
            
            return res.status(200).json({
                status: 'success',
                data: result.data,
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
}

module.exports = new SchoolController();
