const crypto = require('crypto');
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
    },

    async forgotPassword(req, res) {
        const { email } = req.body;
        const user = await userRepository.findByEmail(email);
    
        if (!user) return res.status(404).json({ 
            message: "Email not registed." 
        });

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000);

        await userRepository.updateResetToken(user.id_user, token, expires);

        const resetUrl = `${process.env.BASE_URL_FRONTEND}/reset-password/${token}`;
        const html = `
            <h3>Password Reset Request</h3>
            <p>You are receiving this email because you requested a password reset.</p>
            <p>Please click the link below (valid for 1 hours):</p>
            <a href="${resetUrl}">${resetUrl}</a>
    `;

        await sendEmail(user.email, 'Reset Password Instruction', html);
        res.json({ 
            status: "success", 
            message: "Password reset link has been sent to your email." 
        });
    },

    async resetPassword(req, res) {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await userRepository.findByResetToken(token);

        if (!user || user.reset_password_expires < new Date()) {
            return res.status(400).json({ 
                message: "Token unvalid or expired." 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userRepository.updatePasswordAndClearToken(user.id_user, hashedPassword);

        res.json({ 
            status: "success", 
            message: "Password updated successfully." 
        });
    }
};

module.exports = authController;
