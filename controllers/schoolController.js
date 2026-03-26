const { School, DailyReport, Sppg, Review, Attachment, User, sequelize } = require('../models');

const schoolController = {
    async getSppgList(req, res) {
        try {
            const sppgList = await Sppg.findAll({
                attributes: [
                    'id_sppg', 
                    'sppg_name', 
                    'sppg_address'
                ],
                order: [['sppg_name', 'ASC']]
            });

            return res.status(200).json({
                status: 'success',
                data: sppgList
            });
        } catch (error) {
            console.error('Error getSppgList:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getProfile(req, res) {
        try {
            const school = await School.findOne({ 
                where: { 
                    id_user: req.user.id_user 
                } 
            });
      
            if (!school) return res.status(404).json({ 
                message: 'School profile not found' 
            });
      
            return res.status(200).json({ 
                status: 'success', 
                data: school 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    },

    async updateProfile(req, res) {
        try {
            const { school_name, school_address } = req.body;
            const school = await School.findOne({ 
                where: { 
                    id_user: req.user.id_user 
                } 
            });
      
            if (!school) return res.status(404).json({ 
                message: 'School profile not found' 
            });

            await school.update({ 
                school_name, 
                school_address 
            });
            return res.status(200).json({ 
                status: 'success', 
                message: 'Profile updated', 
                data: school 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    },

    async getDailyReports(req, res) {
        try {
            const reports = await DailyReport.findAll({
                order: [['date_report', 'DESC']],
                include: [{
                    model: Sppg,
                    as: 'sppg',
                    attributes: [
                        'sppg_name', 
                        'sppg_address'
                    ]
                }]
            });
            return res.status(200).json({ 
                status: 'success', 
                data: reports 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    },

    async createReview(req, res) {
        const t = await sequelize.transaction();
        try {
            const school = await School.findOne({ 
                where: { 
                    id_user: req.user.id_user 
                } 
            });
            if (!school) {
                await t.rollback();
                return res.status(404).json({ 
                    message: 'Profil sekolah tidak ditemukan' 
                });
            }

            const { id_sppg, title, description, rating_score } = req.body;

            const sppg = await Sppg.findByPk(id_sppg);
            if (!sppg) {
                await t.rollback();
                return res.status(404).json({ 
                    message: 'Instansi SPPG not found' 
                });
            }

            const newReview = await Review.create({
                id_user: req.user.id_user,
                id_school: school.id_school,
                id_sppg: id_sppg,
                title,
                description,
                rating_score,
                status_review: 'MENUNGGU'
            }, { transaction: t });

            if (req.files && req.files.length > 0) {
                const attachmentData = req.files.map(file => ({
                    entity_type: 'REVIEW',
                    id_entity: newReview.id_review,
                    file_url: file.path,
                    file_type: file.mimetype
                }));
                await Attachment.bulkCreate(attachmentData, { transaction: t });
            }

            await t.commit();
            return res.status(201).json({ 
                status: 'success', 
                message: 'Review has been sent', 
                data: newReview 
            });

        } catch (error) {
            await t.rollback();
            console.error('Error createReview (School):', error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    },

    async getDashboardReviews(req, res) {
        try {
            const publicReviews = await Review.findAll({
                order: [['createdAt', 'DESC']],
                limit: 15,
                include: [
                    {
                        model: School,
                        as: 'school',
                        attributes: ['school_name']
                    },
                    {
                        model: Attachment,
                        as: 'attachments',
                        where: { entity_type: 'REVIEW' },
                        required: false,
                        attributes: ['file_url']
                    },
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            'username', 
                            'role'
                        ]
                    }
                ]
            });

            const formattedLaporan = publicReviews.map(review => {
                const reviewData = review.toJSON();
                
                const userRole = reviewData.user ? reviewData.user.role : 'PUBLIC';
                const userName = reviewData.user ? reviewData.user.username : 'Anonim';
                const schoolName = reviewData.school ? reviewData.school.school_name : 'Sekolah Tidak Diketahui';

                let authorName = '';
                let displayAuthor = '';

                if (userRole === 'SCHOOL') {
                    authorName = userName;
                    displayAuthor = `${schoolName}`;
                } else {
                    authorName = 'Anonim';
                    displayAuthor = `Anonim - ${schoolName}`;
                }

                return {
                    ...reviewData,
                    author_name: authorName,
                    display_author: displayAuthor,
                    school_name: schoolName,
                    user: undefined 
                };
            });

            return res.status(200).json({
                status: 'success',
                data: formattedLaporan
            });
        } catch (error) {
            console.error('Error getDashboardReviews:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getDashboardSppgReports(req, res) {
        try {
            const laporanSppg = await DailyReport.findAll({
                order: [['createdAt', 'DESC']],
                limit: 15,
                include: [
                    {
                        model: Sppg,
                        as: 'sppg',
                        attributes: [
                            'sppg_name', 
                            'sppg_address'
                        ]
                    },
                    {
                        model: Attachment,
                        as: 'attachments',
                        where: { entity_type: 'DAILY_REPORT' },
                        required: false,
                        attributes: ['file_url']
                    }
                ]
            });

            return res.status(200).json({
                status: 'success',
                data: laporanSppg
            });
        } catch (error) {
            console.error('Error getDashboardSppgReports:', error);
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = schoolController;
