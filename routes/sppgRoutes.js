const express = require('express');
const router = express.Router();
const sppgController = require('../controllers/sppgController');
const { verifyToken, isSppg } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/profile', 
    verifyToken, 
    isSppg, 
    sppgController.getProfile
);

router.put('/profile', 
    verifyToken, 
    isSppg, 
    sppgController.updateProfile
);

router.get('/dashboard', 
    verifyToken, 
    isSppg, 
    sppgController.getDashboardData
);

router.get('/daily_report', 
    verifyToken, 
    isSppg, 
    sppgController.getDailyReports
);

router.post('/daily_report', 
    verifyToken, 
    isSppg, 
    upload.array('attachments', 2), 
    sppgController.createDailyReport);

router.get('/daily_report/periodic', 
    verifyToken, 
    isSppg, 
    sppgController.getPeriodicReports
);

router.get('/daily_report/:id_report', 
    verifyToken, 
    isSppg, 
    sppgController.getDailyReportById
);

router.patch('/monthly_budget', 
    verifyToken, 
    isSppg, 
    sppgController.updateMonthlyBudget
);

module.exports = router;
