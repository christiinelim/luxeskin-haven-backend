const express = require('express');
const router = express.Router();

const productServices = require('../../services/product_service');

router.post('/', async (req, res) => {
    try {
        const { skin_types, ...productData } = req.body;
        const response = await productServices.createProduct(skin_types, productData);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const response = await productServices.getProductById(productId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/seller/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const response = await productServices.getProductBySeller(sellerId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ data: response });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const response = await productServices.deleteProduct(productId);
        if (response.error) {
            res.status(200).json({ error: response.error });
        } else {
            res.status(200).json({ message: "Product deleted successfully" });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const productData = req.body
        const response = await productServices.updateProduct(productId, productData);

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