const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const schoolValidator = require('../validators/schoolValidator');
const { verifyToken, isSchool } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/uploadMiddleware');

router.use(verifyToken, isSchool);
router.get('/profile', schoolController.getProfile);
router.put('/profile', 
    schoolValidator.updateProfile, 
    validate, 
    schoolController.updateProfile
);

router.get('/sppg_list', 
    schoolValidator.checkPagination, 
    validate, 
    schoolController.getSppgList
);

router.get('/daily_report', 
    schoolValidator.checkPagination, 
    validate, 
    schoolController.getDailyReports
);

router.post('/review', 
    upload.array('attachments', 2),
    schoolValidator.createReview, 
    validate, 
    schoolController.createReview
);

router.get('/dashboard/reviews', 
    schoolValidator.checkPagination, 
    validate, 
    schoolController.getDashboardReviews
);

router.get('/dashboard/sppg_reports', 
    schoolValidator.checkPagination, 
    validate, 
    schoolController.getDashboardSppgReports
);

module.exports = router;
