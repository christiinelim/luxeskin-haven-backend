const express = require('express');
const router = express.Router();

const discountServices = require('../../services/discount_service');

router.post('/', async (req, res) => {
    try {
        const { product_id, ...discountData } = req.body;
        const response = await discountServices.createDiscount(product_id, discountData);
        if (response) {
            res.status(200).json({ data: response });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/:discountId', async (req, res) => {
    try {
        const discountId = req.params.discountId;
        const response = await discountServices.getDiscountById(discountId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:discountId', async (req, res) => {
    try {
        const discountId = req.params.discountId;
        const response = await discountServices.deleteDiscount(discountId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ message: "Discount deleted successfully" });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:discountId', async (req, res) => {
    try {
        const discountId = req.params.discountId;
        const { product_id, ...discountData } = req.body;
        const response = await discountServices.updateDiscount(discountId, product_id, discountData);

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