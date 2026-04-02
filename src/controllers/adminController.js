const adminService = require('../service/adminService');

const adminController = {
    async approveAccount(req, res, next) {
        try {
            const { id_user } = req.params;
            const adminEmail = req.user.email; 
            const result = await adminService.approveAccount(id_user, adminEmail);

            return res.status(200).json({
                status: 'success',
                message: 'Account approved successfully',
                data: result
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }
            next(error);
        }
    },

    async getProfile(req, res, next) {
        try {
            const profile = await adminService.getProfile(req.user.id_user);
            
            return res.status(200).json({ 
                status: 'success', 
                data: profile 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Admin Profile not found' 
                });
            }
            next(error);
        }
    },

    async getPendingAccounts(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await adminService.getPendingAccounts(page, limit);
            
            return res.status(200).json({ 
                status: 'success', 
                ...result 
            });
        } catch (error) {
            next(error);
        }
    },

    async getActiveAccounts(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await adminService.getActiveAccounts(page, limit);
            
            return res.status(200).json({ 
                status: 'success', 
                ...result 
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllSppg(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await adminService.getAllSppg(page, limit);
            
            return res.status(200).json({ 
                status: 'success', 
                ...result 
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllSchool(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await adminService.getAllSchool(page, limit);
            
            return res.status(200).json({ 
                status: 'success', 
                ...result 
            });
        } catch (error) {
            next(error);
        }
    },

    async updateAccountStatus(req, res, next) {
        try {
            const { id_user } = req.params;
            const { status } = req.body;
            
            const data = await adminService.updateAccountStatus(id_user, status);
            return res.status(200).json({
                status: 'success',
                message: `Account has been successfully ${status.toLowerCase()}.`,
                data
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req, res, next) {
        try {
            const id_user = req.user.id_user;
            const updateData = req.body;

            const data = await adminService.updateAdminProfile(id_user, updateData);
            return res.status(200).json({
                status: 'success',
                message: 'Admin profile updated successfully.',
                data
            });
        } catch (error) {
            next(error);
        }
    },

    async getDashboardData(req, res, next) {
        try {
            const data = await adminService.getDashboardData();
            return res.status(200).json({ 
                status: 'success', 
                data 
            });
        } catch (error) {
            next(error);
        }
    },

    async updateReviewStatus(req, res, next) {
        try {
            const { id_review } = req.params;
            const { status_review } = req.body;

            const data = await adminService.updateReviewStatus(id_review, status_review);
            return res.status(200).json({
                status: 'success',
                message: 'Review status updated successfully.',
                data
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = adminController;
