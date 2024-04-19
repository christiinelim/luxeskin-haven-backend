const express = require('express');
const router = express.Router();

const { getHashedPassword } = require('../utils/index')
const sellerServices = require('../services/seller_service');

router.post('/create', async (req, res) => {
    try {
        const existingSeller = await sellerServices.getSellerByEmail(req.body.email);

        if (existingSeller) {
            return res.status(200).json({ error: "Email is already registered with an account" });
        }

        const { password, ...rest } = req.body;
        const hashedPassword = getHashedPassword(password);
        const sellerData = {
            ...rest,
            password: hashedPassword,
        };

        const newSeller = await sellerServices.createSeller(sellerData);
        res.status(200).json({ data: newSeller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = getHashedPassword(password);
        const foundSeller = await sellerServices.getSellerByEmailAndPassword(email, hashedPassword);
        if (foundSeller) {
            res.status(200).json({ data: foundSeller });
        } else {
            res.status(404).json({ error: "Wrong email or password" });
        }  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    const existingSeller = await sellerServices.getSellerByEmail(req.body.email);

    if (!existingSeller) {
        return res.status(200).json({ error: "Account does not exist" });
    }

    // send verification token
})

// add middleware for check if authenticated for updateProfile
router.post('/update/:sellerId', async (req, res) => {
    const sellerId = req.params.sellerId;
    const sellerData = await updatedSellerData
})

module.exports = router;