const { body } = require('express-validator');

const authValidator = {
    login: [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],

    registerPublic: [
        body('username')
            .notEmpty().withMessage('Username is required')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Must be a valid email address'),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],

    registerSchool: [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Must be a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('school_name').notEmpty().withMessage('School name is required'),
        body('school_address').notEmpty().withMessage('School address is required'),
        body('registration_code').optional().isString()
    ],

    registerSppg: [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Must be a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('sppg_name').notEmpty().withMessage('SPPG name is required'),
        body('sppg_address').notEmpty().withMessage('SPPG address is required'),
        body('bgn_code').optional().isString()
    ]
};

module.exports = authValidator;
