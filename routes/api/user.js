const express = require('express');
const router = express.Router();

const { getHashedPassword, generateAccessToken } = require('../../utils');
const { authenticateWithJWT, authenticateJWTRefreshToken } = require('../../middlewares');
const userServices = require('../../services/user_service');
const blacklistedTokenServices = require('../../services/blacklisted_tokens_service')

router.post('/', async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await getHashedPassword(password);
        const userData = {
            ...rest,
            password: hashedPassword,
        };

        const response = await userServices.createUser(userData);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/verify-account', async (req, res) => {
    try {     
        const { email, ...tokenData } = req.body
        const response = await userServices.verifyUser(email, tokenData);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await userServices.getUserByEmailAndPassword(email, password);
        
        if (response.error) {
            if (response.error === "Wrong email or password") {
                res.status(200).json({ error: response.error });
            } else if (response.error === "Account not verified") {
                res.status(200).json(response);
            } else {
                res.status(200).json({ error: response.error });
            }
        } else {
            const accessToken = generateAccessToken(response.id, response.email, process.env.JWT_ACCESS_TOKEN_SECRET, "10m");
            const refreshToken = generateAccessToken(response.id, response.email, process.env.JWT_REFRESH_TOKEN_SECRET, "1h");
            response.accessToken = accessToken;
            response.refreshToken = refreshToken;
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {    
        const response = await userServices.initiatePasswordReset(req.body.email);

        if (response.error) {
            return res.status(200).json({ error: response.error });
        }
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/update-password', async (req, res) => {
    try {    
        const { email, password, ...tokenData } = req.body
        const hashedPassword = await getHashedPassword(password);
        const response = await userServices.updatePassword(email, hashedPassword, tokenData);

        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:userId', authenticateWithJWT, async (req, res) => {
    try {
        const userId = req.params.userId;
        let userData

        if (req.body.password) {
            const { password, ...rest } = req.body;
            const hashedPassword = await getHashedPassword(password);
            userData = {
                ...rest,
                password: hashedPassword,
            };
        } else {
            userData = { ...req.body };
        }
        
        const response = await userServices.updateUser(userId, userData);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:userId', authenticateWithJWT, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await userServices.deleteUser(userId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:userId', authenticateWithJWT, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await userServices.getUserById(userId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/refresh-token', authenticateJWTRefreshToken);

router.post('/logout', authenticateWithJWT, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await blacklistedTokenServices.createBlacklistedToken(refreshToken);
        res.status(200).json({ data: "Refresh token blacklisted" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;