const jwt = require('jsonwebtoken');

const authMiddleware = {
    verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Access denied. No token provided.' 
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = decoded; 
            next();
        } catch (error) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Invalid or expired token.' 
            });
        }
    },

    isAdmin(req, res, next) {
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Access denied. You do not have ADMIN privileges.' 
            });
        }
        next();
    },

    isSppg(req, res, next) {
        if (!req.user || req.user.role !== 'SPPG') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Access denied. Requires SPPG role.' 
            });
        }
        next();
    },

    isSchool(req, res, next) {
        if (!req.user || req.user.role !== 'SCHOOL') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Access denied. Requires SCHOOL role.' 
            });
        }
        next();
    },

    isPublic(req, res, next) {
        if (!req.user || req.user.role !== 'PUBLIC') {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Access denied. Requires PUBLIC role.' 
            });
        }
        next();
    }
};

module.exports = authMiddleware;
