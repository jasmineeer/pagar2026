const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController'); 
const { verifyToken, isSchool } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Sesuaikan path jika berbeda

router.get('/profile', 
    verifyToken, 
    isSchool, 
    schoolController.getProfile
);

router.put('/profile', 
    verifyToken, 
    isSchool, 
    schoolController.updateProfile
);

router.get('/sppg_list', 
    verifyToken, 
    isSchool, 
    schoolController.getSppgList
);

router.get('/daily_report', 
    verifyToken, 
    isSchool, 
    schoolController.getDailyReports
);

router.post('/review', 
    verifyToken, 
    isSchool, 
    upload.array('attachments', 2),
    schoolController.createReview
);

router.get('/dashboard/reviews', 
    verifyToken, 
    isSchool, 
    schoolController.getDashboardReviews
);

router.get('/dashboard/sppg_reports', 
    verifyToken, 
    isSchool, 
    schoolController.getDashboardSppgReports
);

module.exports = router;
