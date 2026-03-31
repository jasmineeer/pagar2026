const { body } = require('express-validator');

const publicValidator = {
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
    ]
};

module.exports = publicValidator;
