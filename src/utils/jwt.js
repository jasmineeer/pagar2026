const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key_kamu';

const generateToken = (payload, expiresIn = '24h') => {
    return jwt.sign(
        payload, 
        SECRET_KEY, { 
            expiresIn 
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = {
    generateToken,
    verifyToken
};
