const adminRepository = require('../repositories/adminRepository');
const HttpError = require('../utils/HttpError');
const bcrypt = require('bcrypt');
const { sendApprovalEmail } = require('../utils/email');

const adminService = {
    _formatPagination(result, page, limit) {
        return {
            totalItems: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: page,
            data: result.rows
        };
    },

    async getProfile(id_user) {
        const profile = await adminRepository.getProfile(id_user);

        if (!profile) {
            throw new Error('NOT_FOUND');
        }

        return profile;
    },

    async approveAccount(id_user, adminEmail) {
        const user = await userRepository.updateAccountStatus(id_user, 'approved');

        if (!user) {
            throw new Error('NOT_FOUND');
        }

        try {
            await sendApprovalEmail(
                user.email, 
                user.name, 
                adminEmail
            );
        } catch (error) {
            console.error('Gagal mengirim email approval:', error.message);
        }

        return user;
    },

    async getPendingAccounts(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await adminRepository.getUsersByStatusAndRole('PENDING', ['SPPG', 'SCHOOL'], limit, offset);
        return this._formatPagination(result, page, limit);
    },

    async getActiveAccounts(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await adminRepository.getUsersByStatusAndRole('APPROVED', ['SPPG', 'SCHOOL'], limit, offset);
        return this._formatPagination(result, page, limit);
    },

    async getAllSppg(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await adminRepository.getAllSppg(limit, offset);
        return this._formatPagination(result, page, limit);
    },

    async getAllSchool(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await adminRepository.getAllSchool(limit, offset);
        return this._formatPagination(result, page, limit);
    },

    async updateAccountStatus(id_user, status) {
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            throw new HttpError(400, 'Invalid status. Use APPROVED or REJECTED.');
        }

        const user = await adminRepository.findUserById(id_user);
        if (!user) throw new HttpError(404, 'User not found');

        await adminRepository.updateUserStatus(user, status);

        if (status === 'APPROVED') {
            if (user.role === 'SCHOOL') {
                const school = await adminRepository.findSchoolByUserId(id_user);
                if (!school) {
                    await adminRepository.createSchoolProfile(id_user, `New School (${user.username})`);
                }
            } else if (user.role === 'SPPG') {
                const sppg = await adminRepository.findSppgByUserId(id_user);
                if (!sppg) {
                    await adminRepository.createSppgProfile(id_user, `New Vendor (${user.username})`);
                }
            }
        }

        return { 
            id_user: user.id_user, 
            account_status: status 
        };
    },

    async updateAdminProfile(id_user, updateData) {
        const admin = await adminRepository.findUserById(id_user);
        if (!admin) throw new HttpError(404, 'Admin profile not found');

        let dataToUpdate = {
            name: updateData.name || admin.name,
            username: updateData.username || admin.username,
            email: updateData.email || admin.email
        };

        if (updateData.password) {
            dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
        }

        await adminRepository.updateUser(admin, dataToUpdate);

        return {
            id_user: admin.id_user,
            name: dataToUpdate.name,
            username: dataToUpdate.username,
            email: dataToUpdate.email
        };
    },

    async getDashboardData() {
        const totalReports = await adminRepository.countDailyReports();
        const totalSppg = await adminRepository.countUsers('SPPG', 'APPROVED');
        const totalSchool = await adminRepository.countUsers('SCHOOL', 'APPROVED');
        const totalPublic = await adminRepository.countUsers('PUBLIC');
        
        const recent_complaints = await adminRepository.getRecentComplaints();
        const vendor_warnings = await adminRepository.getVendorWarnings();

        return {
            statistics: { 
                totalReports, 
                totalSppg, 
                totalSchool, 
                totalPublic 
            },
            recent_complaints,
            vendor_warnings
        };
    },

    async updateReviewStatus(id_review, status_review) {
        if (!['MENUNGGU', 'INVESTIGASI', 'SELESAI'].includes(status_review)) {
            throw new HttpError(400, 'Invalid status review.');
        }

        const review = await adminRepository.findReviewById(id_review);
        if (!review) throw new HttpError(404, 'Review not found');

        await adminRepository.updateReviewStatus(review, status_review);
        return review;
    }
};

module.exports = adminService;
