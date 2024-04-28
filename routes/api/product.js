const express = require('express');
const router = express.Router();

const productServices = require('../../services/product_service');
const categoryServices = require('../../services/category_service');
const skinTypeServices = require('../../services/skin_types_services');
const { authenticateWithJWT } = require('../../middlewares/index');

router.post('/', async (req, res) => {
    try {
        const { skin_types, ...productData } = req.body;
        const response = await productServices.createProduct(skin_types, productData);
        res.status(200).json({ data: response });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const response = await categoryServices.getAllCategories();
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/skin-types', async (req, res) => {
    try {
        const response = await skinTypeServices.getAllSkinTypes();
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

router.get('/public/:productId', async (req, res) => {
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

router.get('/', async (req, res) => {
    try {
        const response = await productServices.getAllProducts();
        res.status(200).json({ data: response });
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

router.put('/:productId', authenticateWithJWT, async (req, res) => {
    try {
        const productId = req.params.productId;
        const { skin_types, ...productData } = req.body;
        const response = await productServices.updateProduct(productId, skin_types, productData);

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