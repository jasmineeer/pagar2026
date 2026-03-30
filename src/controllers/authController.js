const authService = require('../service/authService');

const authController = {
    async registerPublic(req, res, next) {
        try {
            const newUser = await authService.registerPublic(req.body);

            return res.status(201).json({
                status: 'success',
                message: 'Public registration successful.',
                data: {
                    id_user: newUser.id_user,
                    username: newUser.username,
                    role: newUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async registerSchool(req, res, next) {
        try {
            const newUser = await authService.registerSchool(req.body);

            return res.status(201).json({
                status: 'success',
                message: 'School registration successful. Waiting for Admin approval.',
                data: {
                    id_user: newUser.id_user,
                    username: newUser.username,
                    role: newUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async registerSppg(req, res, next) {
        try {
            const newUser = await authService.registerSppg(req.body);

            return res.status(201).json({
                status: 'success',
                message: 'SPPG registration successful. Waiting for Admin approval.',
                data: {
                    id_user: newUser.id_user,
                    username: newUser.username,
                    role: newUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { token, user } = await authService.login(req.body);

            return res.status(200).json({
                status: 'success',
                message: 'Login successful.',
                data: {
                    token,
                    user: {
                        id_user: user.id_user,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;
