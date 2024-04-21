const jwt = require('jsonwebtoken');

const authenticateWithJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (error, payload) => {
            if (error) {
                res.status(400);
                return res.json({
                    "error": error
                })
            } else {
                req.payload = payload;
                next();
            }
        })
    } else {
        res.status(400);
        res.json({
            "error": "Unauthorized, please login"
        })
    }
};

const csrfErrorHandler = (error, req, res, next) => {
    if (error.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: 'CSRF token validation failed' });
    } else {
        next(error);
    }
}; 

module.exports = { authenticateWithJWT, csrfErrorHandler }