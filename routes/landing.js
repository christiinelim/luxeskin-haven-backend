const express = require('express');
const router = express.Router();

const sellerServices = require('../services/seller_service');
const productServices = require('../services/product_service');

// seller list
router.get('/', async (req, res) => {
    try {
        const sellerData = await sellerServices.getSellers();

        res.render('landing', {
            sellers: sellerData.toJSON(),
            warning: {
                action: 'blacklist',
                message: 'By blacklisting, the seller will no longer have access to his/her account and his/her listings will no longer be on the platform.',
                header: 'Blacklist Seller'
            }
        });
    } catch (error) {
        console.log(error)
    }
   
})

// product list
router.get('/products', async (req, res) => {
    try {
        const productData = await productServices.getAllProducts();

        res.render('landing/products', {
            products: productData.toJSON(),
            warning: {
                action: 'delete',
                message: 'By deleting the product, it will be removed from all platforms and the seller will lose the listing.',
                header: 'Delete Product'
            }
        });
    } catch (error) {
        console.log(error)
    } 
})

// delete
router.delete('/products/delete/:productId', async (req, res) => {
    try {
        console.log("delete route")
        const productId = req.params.productId;
        await productServices.deleteProduct(productId);
        req.flash('success_messages', 'Product has been successfully deleted')
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;