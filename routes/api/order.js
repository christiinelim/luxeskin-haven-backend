const express = require('express');
const router = express.Router();

const orderServices = require('../../services/order_service');
const { authenticateWithJWT } = require('../../middlewares');

router.post('/', async (req, res) => {
    try {
        const { products, ...orderData } = req.body;
        const order = await orderServices.createOrder(products, orderData);
        res.status(200).json({ data: order });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:orderId', authenticateWithJWT, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const response = await orderServices.getOrderById(orderId);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/user/:userId', authenticateWithJWT, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await orderServices.getOrderByUser(userId);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/seller/:sellerId', authenticateWithJWT, async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const response = await orderServices.getOrderBySeller(sellerId);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/product', authenticateWithJWT, async (req, res) => {
    try {
        const { ...data } = req.body;
        const response = await orderServices.updateOrderProductPivot(data);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/product/:orderId', authenticateWithJWT, async (req, res) => {
    try {
        const orderId = req.params.orderId
        const response = await orderServices.getOrderProductPivot(orderId);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;