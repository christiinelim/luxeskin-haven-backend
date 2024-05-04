const jwt = require('jsonwebtoken');
const blacklistedTokenServices = require('../services/blacklisted_tokens_service');
const { generateAccessToken } = require('../utils');

const authenticateWithJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        try {
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, payload) => {
                if (error) {
                    res.status(401).json({ error });
                } else {
                    req.payload = payload;
                    next();
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(401).json({ error: "Unauthorized, please login" });
    }
};


const authenticateJWTRefreshToken = (req, res, next) => {
    const { refreshToken, id, email } = req.body;

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (error) => {
            if (error) {
                res.status(401).json({ error });
            } else {
                const blacklistedToken = await blacklistedTokenServices.getBlacklistedToken(refreshToken);
            
                if (blacklistedToken) {
                    res.status(401).json({ error: 'Invalid refresh token' });
                } else {
                    const accessToken = generateAccessToken(id, email, process.env.JWT_ACCESS_TOKEN_SECRET, "10m");
                    res.status(200).json({ accessToken });
                }
            }

            next();
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = { authenticateWithJWT, authenticateJWTRefreshToken }