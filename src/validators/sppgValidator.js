const { body, param, query } = require('express-validator');

const sppgValidator = {
    paginationOnly: [
        query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive number'),
        query('limit').optional().isInt({ min: 1 }).toInt().withMessage('Limit must be a positive number')
    ],

    getPeriodic: [
        query('start_date').notEmpty().isISO8601().withMessage('Valid start_date required (YYYY-MM-DD)'),
        query('end_date').notEmpty().isISO8601().withMessage('Valid end_date required (YYYY-MM-DD)'),
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1 }).toInt()
    ],

    createDailyReport: [
        body('date_report').notEmpty().isISO8601().withMessage('Valid date_report is required'),
        body('menu_name').notEmpty().isString().withMessage('Menu name is required'),
        body('meal_time').notEmpty().isString().withMessage('Meal time is required'),
        body('total_portion').notEmpty().isInt({ min: 1 }).withMessage('Portion must be a number'),
        body('energy').notEmpty().isNumeric(),
        body('protein').notEmpty().isNumeric(),
        body('fat').notEmpty().isNumeric(),
        body('carbohydrate').notEmpty().isNumeric(),
        body('budgets')
            .notEmpty().withMessage('Budgets detail is required')
            .custom((value) => {
                try {
                    const data = typeof value === 'string' ? JSON.parse(value) : value;
                    if (!Array.isArray(data) || data.length === 0) {
                        throw new Error('Budgets must be a non-empty array');
                    }
                    if (!data[0].item_name || !data[0].item_price) {
                        throw new Error('Each budget item must have item_name and item_price');
                    }
                    return true;
                } catch (e) {
                    throw new Error(e.message || 'Invalid JSON format for budgets');
                }
            })
    ],

    updateBudget: [
        body('monthly_budget').notEmpty().isNumeric().withMessage('Monthly budget is required (number)')
    ],

    checkUUID: [
        param('id_daily_report').isUUID().withMessage('ID must be a valid UUID')
    ]
};

module.exports = sppgValidator;
