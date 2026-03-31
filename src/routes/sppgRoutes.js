const express = require('express');
const router = express.Router();
const sppgController = require('../controllers/sppgController');
const sppgValidator = require('../validators/sppgValidator');
const { verifyToken, isSppg } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/uploadMiddleware');

router.use(verifyToken, isSppg);

router.get('/profile', 
    sppgController.getProfile
);

router.get('/dashboard', 
    sppgController.getDashboardData
);

router.put('/profile', 
    sppgController.updateProfile
);

router.get('/daily_reports', 
    sppgValidator.paginationOnly, 
    validate, 
    sppgController.getDailyReports
);

router.get('/periodic_reports', 
    sppgValidator.getPeriodic, 
    validate, 
    sppgController.getPeriodicReports
);

router.get('/reports/export',
    sppgValidator.getPeriodic,
    validate,
    sppgController.downloadReport
)

router.post('/daily_report', 
    upload.array('attachments', 2),
    sppgValidator.createDailyReport, 
    validate, 
    sppgController.createDailyReport
);

router.get('/daily_report/:id_daily_report', 
    sppgValidator.checkUUID,
    validate, 
    sppgController.getDailyReportById
);

router.patch('/monthly-budget', 
    sppgValidator.updateBudget, 
    validate, 
    sppgController.updateMonthlyBudget
);

module.exports = router;
