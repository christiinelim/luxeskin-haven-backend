const express = require('express');
const router = express.Router();

const { authenticateWithJWT } = require('../../middlewares');
const cartServices = require('../../services/cart_service');

router.get('/user/:userId', authenticateWithJWT, async (req, res) => {
    try {   
        const userId = req.params.userId;
        const response = await cartServices.getCartItemsByUser(userId);

        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/', authenticateWithJWT, async (req,res) => {
    try {
        const { quantity, ...cartData } = req.body
        const response = await cartServices.addToCart(quantity, cartData);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.put('/:cartId', authenticateWithJWT, async (req,res) => {
    try {
        const cartId = req.params.cartId;
        const { quantity, ...cartData } = req.body
        const response = await cartServices.updateCartItem(cartId, quantity, cartData);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.delete('/:cartId', authenticateWithJWT, async (req,res) => {
    try {
        const cartId = req.params.cartId;
        const response = await cartServices.deleteCartItem(cartId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;