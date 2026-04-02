const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminValidator = require('../validators/adminValidator');
const validate = require('../middlewares/validate');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.use(
    verifyToken, 
    isAdmin
);

router.get('/profile', 
    adminController.getProfile
);

router.get('/accounts/pending', 
    adminController.getPendingAccounts
);

router.get('/accounts/active', 
    adminController.getActiveAccounts
);

router.get('/sppgs', 
    adminController.getAllSppg
);

router.get('/schools', 
    adminController.getAllSchool
);

router.get('/dashboard', 
    adminController.getDashboardData
);

router.patch(
    '/accounts/:id_user/status', 
    adminValidator.updateAccountStatus, 
    validate,                           
    adminController.updateAccountStatus 
);

router.patch(
    '/accounts/profile', 
    adminValidator.updateProfile, 
    validate, 
    adminController.updateProfile
);

router.patch(
    '/reviews/:id_review/status', 
    adminValidator.updateReviewStatus, 
    validate, 
    adminController.updateReviewStatus
);

module.exports = router;
