const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/auth.validator');
const validate = require('../middlewares/validate');

router.post(
    '/register/public', 
    authValidator.registerPublic,
    validate,
    authController.registerPublic
);

router.post(
    '/register/school', 
    authValidator.registerSchool, 
    validate, 
    authController.registerSchool
);

router.post(
    '/register/sppg', 
    authValidator.registerSppg, 
    validate, 
    authController.registerSppg
);

router.post(
    '/login', 
    authValidator.login, 
    validate, 
    authController.login
);

module.exports = router;
