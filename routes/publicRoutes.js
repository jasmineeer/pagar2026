const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController'); 
const { verifyToken, isPublic } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/sppg_list', 
    verifyToken, 
    isPublic, 
    publicController.getSppgList
);

router.post('/review', 
    verifyToken, 
    isPublic, 
    upload.array('attachments', 2), 
    publicController.createReview
);

router.get('/dashboard/reviews', 
    verifyToken, 
    isPublic, 
    publicController.getDashboardReviews
);

router.get('/dashboard/sppg_reports', 
    verifyToken, 
    isPublic, 
    publicController.getDashboardSppgReports
);

module.exports = router;
