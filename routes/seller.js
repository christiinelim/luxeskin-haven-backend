const express = require('express');
const router = express.Router();

const { getHashedPassword, generateAccessToken } = require('../utils/index')
const sellerServices = require('../services/seller_service');
const { authenticateWithJWT } = require('../middlewares/index')

router.post('/create', async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = getHashedPassword(password);
        const sellerData = {
            ...rest,
            password: hashedPassword,
        };

        const response = await sellerServices.createSeller(sellerData);
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
        const response = await sellerServices.verifySeller(email, tokenData);
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
        const hashedPassword = getHashedPassword(password);
        const response = await sellerServices.getSellerByEmailAndPassword(email, hashedPassword);
        
        if (response.error) {
            if (response.error === "Wrong email or password") {
                res.status(200).json({ error: response.error });
            } else if (response.error === "Account not verified") {
                res.status(200).json(response);
            } else {
                res.status(200).json({ error: response.error });
            }
        } else {
            const token = generateAccessToken(response.id, response.email);
            response.token = token;
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/forgot-password', async (req, res) => {
    try {    
        const response = await sellerServices.initiatePasswordReset(req.body.email);

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
        const hashedPassword = getHashedPassword(password);
        const response = await sellerServices.updatePassword(email, hashedPassword, tokenData);

        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/update-profile/:sellerId', [ authenticateWithJWT ], async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const { password, ...rest } = req.body;
        const hashedPassword = getHashedPassword(password);
        const sellerData = {
            ...rest,
            password: hashedPassword,
        };
        const response = await sellerServices.updateSeller(sellerId, sellerData);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:sellerId', [ authenticateWithJWT ], async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const response = await sellerServices.deleteSeller(sellerId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/profile/:sellerId', [ authenticateWithJWT ], async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const response = await sellerServices.getSellerById(sellerId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;