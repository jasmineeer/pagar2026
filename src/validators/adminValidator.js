const { body, param } = require('express-validator');

const adminValidator = {
    checkPagination: [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page harus berupa angka minimal 1'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('Limit harus berupa angka antara 1 - 100')
    ],
    
    updateAccountStatus: [
        param('id_user')
            .notEmpty().withMessage('User ID is required in URL parameter')
            .isUUID().withMessage('User ID must be a valid UUID format'),
        body('status')
            .notEmpty().withMessage('Status is required')
            .isIn(['APPROVED', 'REJECTED']).withMessage(
                'Status must be either APPROVED or REJECTED'
            )
    ],

    updateProfile: [
        body('name')
            .optional()
            .isString().withMessage('Name must be a string'),
        body('username')
            .optional()
            .isString().withMessage('Username must be a string')
            .isLength({ min: 5 }).withMessage(
                'Username must be at least 5 characters long'
            ),
        body('email')
            .optional()
            .isEmail().withMessage(
                'Must be a valid email address'
            ),
        body('password')
            .optional()
            .isLength({ min: 6 }).withMessage(
                'Password must be at least 6 characters long'
            )
    ],

    updateReviewStatus: [
        param('id_review')
            .notEmpty().withMessage(
                'Review ID is required in URL parameter'
            ),
        body('status_review')
            .notEmpty().withMessage(
                'Review status is required'
            )
            .isIn(['MENUNGGU', 'INVESTIGASI', 'SELESAI'])
            .withMessage(
                'Review status must be MENUNGGU, INVESTIGASI, or SELESAI'
            )
    ]
};

module.exports = adminValidator;
