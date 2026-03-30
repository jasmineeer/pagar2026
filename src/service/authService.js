const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/authRepository');
const HttpError = require('../utils/HttpError');
const { generateToken } = require('../utils/jwt');
const { sequelize } = require('../models');

class AuthService {
    async registerPublic(data) {
        const { 
            username, 
            email, 
            password 
        } = data;

        const existingUser = await authRepository.findByUsernameOrEmail(username, email);
        if (existingUser) {
            throw new HttpError(
                400, 
                'Username or Email is already taken.'
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await authRepository.createUser({
            username,
            email,
            password: hashedPassword,
            role: 'PUBLIC',
            account_status: 'APPROVED'
        });

        return newUser;
    }

    async registerSchool(data) {
        const { 
            username, 
            email, 
            password, 
            school_name, 
            school_address, 
            registration_code 
        } = data;

        if (!school_name || !school_address) {
            throw new HttpError(
                400, 
                'School name and address are required.'
            );
        }

        const existingUser = await authRepository.findByUsernameOrEmail(username, email);
        if (existingUser) {
            throw new HttpError(
                400, 
                'Username or Email is already taken.'
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const t = await sequelize.transaction();
        try {
            const newUser = await authRepository.createUser({
                username,
                email,
                password: hashedPassword,
                role: 'SCHOOL',
                registration_code: registration_code || null,
                account_status: 'PENDING'
            }, t);

            await authRepository.createSchool({
                id_user: newUser.id_user,
                school_name,
                school_address
            }, t);

            await t.commit();
            return newUser;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async registerSppg(data) {
        const { 
            username, 
            email, 
            password, 
            sppg_name, 
            sppg_address, 
            bgn_code 
        } = data;

        if (!sppg_name || !sppg_address) {
            throw new HttpError(
                400, 
                'SPPG name and address are required.'
            );
        }

        const existingUser = await authRepository.findByUsernameOrEmail(username, email);
        if (existingUser) {
            throw new HttpError(
                400, 
                'Username or Email is already taken.'
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const t = await sequelize.transaction();
        try {
            const newUser = await authRepository.createUser({
                username,
                email,
                password: hashedPassword,
                role: 'SPPG',
                bgn_code: bgn_code || null,
                account_status: 'PENDING'
            }, t);

            await authRepository.createSppg({
                id_user: newUser.id_user,
                sppg_name,
                sppg_address
            }, t);

            await t.commit();
            return newUser;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async login(data) {
        const { 
            username, 
            password 
        } = data;

        const user = await authRepository.findByUsernameWithPassword(username);
        if (!user) {
            throw new HttpError(
                401, 
                'Invalid credentials.'
            );
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new HttpError(
                401, 
                'Invalid credentials.'
            );
        }

        if (user.account_status === 'PENDING') {
            throw new HttpError(
                403, 
                'Account is waiting for Admin approval.'
            );
        }
        if (user.account_status === 'REJECTED') {
            throw new HttpError(
                403, 
                'Account registration was rejected.'
            );
        }

        const token = generateToken({ 
            id_user: user.id_user, 
            role: user.role 
        });

        return { 
            token, 
            user 
        };
    }
}

module.exports = new AuthService();
