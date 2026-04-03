const { body, query, param } = require('express-validator');

const schoolValidator = {
    checkPagination: [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page harus berupa angka minimal 1'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('Limit harus berupa angka antara 1 - 100')
    ],

    updateProfile: [
        body('school_name')
            .notEmpty().withMessage('Nama sekolah tidak boleh kosong')
            .isString().withMessage('Nama sekolah harus berupa teks')
            .trim(),
        body('school_address')
            .notEmpty().withMessage('Alamat sekolah tidak boleh kosong')
            .isString().withMessage('Alamat sekolah harus berupa teks')
            .trim()
    ],

    createReview: [
        body('id_sppg')
            .notEmpty().withMessage('ID SPPG tidak boleh kosong')
            .isUUID().withMessage('Format ID SPPG tidak valid'),
        body('title')
            .notEmpty().withMessage('Judul review tidak boleh kosong')
            .isString().withMessage('Judul harus berupa teks')
            .isLength({ max: 255 }).withMessage('Judul maksimal 255 karakter')
            .trim(),
        body('description')
            .notEmpty().withMessage('Deskripsi review tidak boleh kosong')
            .isString().withMessage('Deskripsi harus berupa teks')
            .trim(),
        body('rating_score')
            .notEmpty().withMessage('Rating tidak boleh kosong')
            .isInt({ min: 1, max: 5 }).withMessage('Rating harus berupa angka 1 sampai 5')
    ],

    getDetailReport: [
        param('id_daily_report')
            .notEmpty().withMessage('ID Laporan tidak boleh kosong')
            .isUUID().withMessage('Format ID Laporan tidak valid')
    ],
};

module.exports = schoolValidator;
