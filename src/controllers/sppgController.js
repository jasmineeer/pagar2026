const sppgService = require('../service/sppgService');

const sppgController = {
    async getProfile(req, res, next) {
        try {
            const profile = await sppgService.getProfile(req.user.id_user);
            return res.status(200).json({ 
                status: 'success', 
                data: profile 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found' 
            });
            next(error);
        }
    },

    async updateProfile(req, res, next) {
        try {
            const updated = await sppgService.updateProfile(req.user.id_user, req.body);
            return res.status(200).json({ 
                status: 'success', 
                message: 'Profile updated', 
                data: updated 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found' 
            });
            next(error);
        }
    },

    async getDashboardData(req, res, next) {
        try {
            const data = await sppgService.getDashboardData(req.user.id_user);
            return res.status(200).json({ 
                status: 'success', 
                data 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found' 
            });
            next(error);
        }
    },

    async getDailyReportById(req, res, next) {
        try {
            const report = await sppgService.getReportById(req.user.id_user, req.params.id_daily_report);
            return res.status(200).json({ 
                status: 'success', 
                data: report 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'Report or SPPG not found' 
            });
            next(error);
        }
    },

    async getPeriodicReports(req, res, next) {
        try {
            const { start_date, end_date } = req.query;
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;

            const data = await sppgService.getPeriodicReports(req.user.id_user, start_date, end_date, page, limit);
            return res.status(200).json({ 
                status: 'success', 
                data 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found' 
            });
            next(error);
        }
    },

    async getDailyReports(req, res, next) {
        try {
            const page = req.query.page || 1; 
            const limit = req.query.limit || 10;

            const data = await sppgService.getDailyReports(req.user.id_user, page, limit);
            return res.status(200).json({ 
                status: 'success', 
                data 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG Profile not found' 
            });
            next(error);
        }
    },

    async downloadReport(req, res, next) {
        try {
            const { start_date, end_date, format } = req.query;

            if (format === 'pdf') {
                const doc = await sppgService.generatePDF(req.user.id_user, start_date, end_date);

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=Report_${start_date}.pdf');
                doc.pipe(res);
            } else {
                const workbook = await sppgService.generateExcel(req.user.id_user, start_date, end_date);

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=Report_${start_date}.xlsx');
                await workbook.xlsx.write(res);
                res.end();
            }
        } catch (error) {
            next(error);
        }
    },

    async createDailyReport(req, res, next) {
        try {
            const result = await sppgService.createDailyReport(req.user.id_user, req.body, req.files);
            return res.status(201).json({ 
                status: 'success', 
                message: 'Daily report created successfully.', 
                data: result 
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG profile not found' 
            });
            next(error);
        }
    },

    async updateMonthlyBudget(req, res, next) {
        try {
            const updated = await sppgService.updateMonthlyBudget(req.user.id_user, req.body.monthly_budget);
            return res.status(200).json({ 
                status: 'success', 
                message: 'Monthly budget updated successfully', 
                data: { 
                    sppg_name: updated.sppg_name, 
                    monthly_budget: updated.monthly_budget 
                }
            });
        } catch (error) {
            if (error.message === 'NOT_FOUND') return res.status(404).json({ 
                status: 'error', 
                message: 'SPPG profile not found' 
            });
            next(error);
        }
    }
};

module.exports = sppgController;
