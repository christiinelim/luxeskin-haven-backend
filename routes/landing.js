const express = require('express');
const router = express.Router();

const sellerServices = require('../services/seller_service');
const productServices = require('../services/product_service');

// seller list
router.get('/', async (req, res) => {

    const sellerData = await sellerServices.getSellers();

    res.render('landing', {
        sellers: sellerData.toJSON()
    });
})

// product list
router.get('/products', async (req, res) => {

    const productData = await productServices.getAllProducts();

    res.render('landing/products', {
        products: productData.toJSON()
    });
})

module.exports = router;